<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Evento;
use App\Models\Categoria;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use App\Notifications\EventSubmitted;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use App\Mail\EventoEstadoCambiadoMailable;
use Illuminate\Support\Facades\Log;

class EventoController extends Controller
{
    //Para sacar los eventos de la semana desde el día actual
    public function index(Request $request)
    {
        $hoy = now()->toDateString();
        $sieteDiasDespues = now()->copy()->addDays(30)->toDateString();
        $page = $request->get('page', 1);

        $cacheKey = "eventos_semana_{$hoy}_pagina_{$page}";

        $eventos = Cache::remember($cacheKey, now()->addMinutes(2), function () use ($hoy, $sieteDiasDespues) {
            return Evento::select('id', 'nombre', 'fecha', 'hora', 'horaFin', 'fechaFin', 'ubicacion', 'estado', 'imagen', 'precio', 'autor', 'descripcion', 'enlace', 'organizador')
                ->with(['categorias:id,sigla'])
                ->where('estado', 'A')
                ->whereDate('fecha', '>=', $hoy)
                ->whereDate('fecha', '<=', $sieteDiasDespues)
                ->orderBy('fecha', 'asc')
                ->paginate(6);
        });

        return response()->json($eventos);
    }

    //Para sacar todos los eventos sin tener en cuenta el estado
    /*public function getAllEvents($autor)
    {
        if ($autor == 'admin') {
            $eventos = Evento::select('id', 'nombre', 'fecha', 'hora', 'ubicacion', 'estado', 'imagen', 'precio', 'autor', 'descripcion', 'enlace')
                ->with(['categorias:id,sigla'])
                ->get();
        } else {
            $eventos = Evento::select('id', 'nombre', 'fecha', 'hora', 'ubicacion', 'estado', 'imagen', 'precio', 'autor', 'descripcion', 'enlace')
                ->with(['categorias:id,sigla'])
                ->where('autor', $autor)
                ->get();
        }
        return response()->json($eventos);
    }*/

    //Descripcion
    public function show($nombre)
    {
        $nombre = str_replace('-', ' ', $nombre);

        $evento = Evento::with(['categorias:id,sigla']) //Asegúrate de incluir "nombre"
            ->where('nombre', $nombre)
            ->first(['id', 'nombre', 'imagen', 'ubicacion', 'fecha', 'fechaFin' , 'precio', 'hora', 'horaFin' , 'descripcion', 'enlace', 'organizador', 'autor']);

        if (!$evento) {
            return response()->json(['error' => 'Evento no encontrado'], 404); 
        }

        return response()->json($evento);
    }

    //Dashboard (Admin/Empresa)
    public function store(Request $request)
    {
        $request->validate([
            'nombre'        => 'required|string|max:200',
            'descripcion'   => 'required',
            'fecha'         => 'required|date|after_or_equal:today',
            'fechaFin'      => 'nullable|date|after_or_equal:fecha',
            'hora'          => 'nullable|date_format:H:i',
            'horaFin'       => 'nullable|date_format:H:i',
            'ubicacion'     => 'required',
            'enlace'        => 'nullable|regex:/^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/',
            'precio'        => 'required|min:0|numeric',
            'organizador'   => 'nullable|string|max:200',
            'imagen'        => 'nullable|image|max:2048',
            'categorias'    => 'required',
        ], [
            'nombre.required'       => 'El nombre del evento es obligatorio.',
            'nombre.max'            => 'El nombre no puede tener más de 200 caracteres.',
            'descripcion.required'  => 'La descripción es obligatoria.',
            'fecha.required'        => 'La fecha es obligatoria.',
            'fecha.after_or_equal'  => 'La fecha debe ser el dia actual o posterior.',
            'fechaFin.date'         => 'La fecha de fin debe ser una fecha válida.',
            'fechaFin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
            'hora.date_format'      => 'La hora debe tener el formato HH:mm.',
            'horaFin.date_format'   => 'La hora de fin debe tener el formato HH:mm.',
            'ubicacion.required'    => 'La ubicación es obligatoria.',
            'enlace.regex'          => 'El enlace debe ser una URL válida (ej: https://www.google.com).',
            'precio.required'       => 'El precio es obligatorio.',
            'precio.numeric'        => 'El precio debe ser un número.',
            'precio.min'            => 'El precio no puede ser negativo.',
            'imagen.image'          => 'El archivo debe ser una imagen.',
            'imagen.max'            => 'La imagen no puede superar los 2MB.',
            'categorias.required'   => 'Debe seleccionar minimo una categoria',
            'organizador.max'       => 'El organizador no puede tener más de 200 caracteres.',
        ]);


        $evento = new Evento();
        $evento->nombre = $request->nombre;
        $evento->descripcion = $request->descripcion;
        $evento->fecha = $request->fecha;
        $evento->hora = $request->hora;
        $evento->ubicacion = $request->ubicacion;
        $evento->enlace = $request->enlace;
        $evento->precio = $request->precio;
        $evento->fechaFin = $request->fechaFin;
        $evento->horaFin = $request->horaFin;
        $evento->organizador = $request->organizador;
        $evento->autor = Auth::user()->nombre;
        $evento->user_id = Auth::id();

        /*if ($request->hasFile('imagen')) {
            $nombreImagen = str_replace(' ', '', $request->nombre . '.' . $request->file('imagen')->getClientOriginalExtension());
            $path = $request->file('imagen')->storeAs('imgEventos', $nombreImagen);
            $evento->imagen = Storage::url($path);
        }*/
        if ($request->hasFile('imagen')) {
            $extension = $request->file('imagen')->getClientOriginalExtension();
            $nombreNormalizado = preg_replace('/[^A-Za-z0-9]/', '', str_replace(' ', '', $request->nombre));
            $nombreImagen = $nombreNormalizado . '.' . $extension;
            $request->file('imagen')->move(public_path('imgEventos'), $nombreImagen);
            $evento->imagen = '/imgEventos/' . $nombreImagen;
        }


        $evento->save();

        if ($request->categorias) {
            $categoriaIds = Categoria::whereIn('sigla', $request->categorias)->pluck('id')->toArray();
            $evento->categorias()->sync($categoriaIds);
        }

        Notification::route('mail', 'eventoslanzarote@eventoslanzarote.es')
            ->notify(new EventSubmitted($evento));

        return response()->json(['mensaje' => 'Evento creado correctamente', 'evento' => $evento], 201);
    }

    //Dashboard (Admin/Empresa)
    public function update(Request $request, $id)
    {
        $evento = Evento::find($id);
        if (!$evento) {
            return response()->json(['error' => 'Evento no encontrado'], 404);
        }

        $request->validate([
            'nombre'        => 'required|string|max:200',
            'descripcion'   => 'required',
            'fecha'         => 'required|date|after_or_equal:today',
            'fechaFin'      => 'nullable|date|after_or_equal:fecha',
            'hora'          => 'nullable|date_format:H:i',
            'horaFin'       => 'nullable|date_format:H:i',
            'ubicacion'     => 'required|string',
            'enlace'        => 'nullable|regex:/^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/',
            'precio'        => 'required|numeric|min:0',
            'imagen'        => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'organizador'   => 'nullable|string|max:200',
            'categorias'    => 'required',
        ], [
            'nombre.required'       => 'El nombre del evento es obligatorio.',
            'nombre.max'            => 'El nombre no puede tener más de 200 caracteres.',
            'descripcion.required'  => 'La descripción es obligatoria.',
            'fecha.required'        => 'La fecha es obligatoria.',
            'fecha.after_or_equal'  => 'La fecha debe ser el día actual o posterior.',
            'fechaFin.date'         => 'La fecha de fin debe ser una fecha válida.',
            'fechaFin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
            'hora.date_format'      => 'La hora debe tener el formato HH:mm.',
            'horaFin.date_format'   => 'La hora de fin debe tener el formato HH:mm.',
            'ubicacion.required'    => 'La ubicación es obligatoria.',
            'enlace.regex'          => 'El enlace debe ser una URL válida (ej: https://www.google.com/algo).',
            'precio.required'       => 'El precio es obligatorio.',
            'precio.numeric'        => 'El precio debe ser un número.',
            'precio.min'            => 'El precio no puede ser negativo.',
            'imagen.image'          => 'El archivo debe ser una imagen.',
            'imagen.max'            => 'La imagen no puede superar los 2MB.',
            'categorias.required'   => 'Debe seleccionar mínimo una categoría.',
            'organizador.max'       => 'El organizador no puede tener más de 200 caracteres.',
        ]);

        $evento->nombre = $request->nombre ?? $evento->nombre;
        $evento->descripcion = $request->descripcion ?? $evento->descripcion;
        $evento->fecha = $request->fecha ?? $evento->fecha;
        $evento->hora = $request->hora ?? $evento->hora;
        $evento->ubicacion = $request->ubicacion ?? $evento->ubicacion;
        $evento->enlace = $request->enlace ?? $evento->enlace;
        $evento->precio = $request->precio ?? $evento->precio;
        $evento->horaFin = $request->horaFin ?? $evento->horaFin;
        $evento->organizador = $request->organizador ?? $evento->organizador;

        if ($request->hasFile('imagen')) {
            $extension = $request->file('imagen')->getClientOriginalExtension();
            $nombreNormalizado = preg_replace('/[^A-Za-z0-9]/', '', str_replace(' ', '', $request->nombre));
            $nombreImagen = $nombreNormalizado . '.' . $extension;
            $request->file('imagen')->move(public_path('imgEventos'), $nombreImagen);
            $evento->imagen = '/imgEventos/' . $nombreImagen;
        }

        $evento->save();

        //ACTUALIZAR CATEGORÍAS (como en el store)
        if ($request->has('categorias')) {
            $categoriaIds = Categoria::whereIn('sigla', $request->categorias)->pluck('id')->toArray();
            $evento->categorias()->sync($categoriaIds);
        }

        return response()->json(['mensaje' => 'Evento actualizado correctamente', 'evento' => $evento]);
    }

    //Dashboard (Admin / Empresa)
    public function destroy($id)
    {
        $evento = Evento::find($id);
        if (!$evento) {
            return response()->json(['error' => 'Evento no encontrado'], 404);
        }

        $evento->delete();
        return response()->json(['mensaje' => 'Evento eliminado correctamente']);
    }

    //Filtrado por categorias
    public function filtrarPorCategoria($categoria)
    {
        $categoriaModel = Categoria::where('sigla', $categoria)->first();
        if (!$categoriaModel) {
            return response()->json(['error' => 'Categoría no encontrada'], 404);
        }

        $eventos = $categoriaModel->eventos()
            ->with('categorias:id,sigla')
            ->where('estado', 'A')
            ->get();
        return response()->json($eventos);
    }

    //Dashboard (Admin)
    public function cambiarEstado(Request $request, $id)
    {
        $evento = Evento::find($id);
        if (!$evento) {
            return response()->json(['error' => 'Evento no encontrado'], 404);
        }

        $request->validate([
            'estado' => 'required|string|in:A,D,P'
        ]);

        $estadoAnterior = $evento->estado;
        $evento->estado = $request->estado;
        $evento->save();

        // Solo enviar correo si el estado cambió
        if ($estadoAnterior !== $evento->estado) {
            $usuario = User::where('nombre', $evento->autor)->first();

            if ($usuario && $usuario->email) {
                Mail::to($usuario->email)->send(new EventoEstadoCambiadoMailable($evento));
            } else {
                Log::warning("No se encontró usuario con nombre: {$evento->autor}");
            }
        }

        return response()->json([
            'mensaje' => 'Estado actualizado correctamente',
            'evento' => $evento,
        ]);
    }


    //Para la busqueda filtrada por nombre
    public function buscarPorNombre(Request $request)
    {
        $nombre = $request->query('nombre');

        $eventos = Evento::select('id', 'nombre', 'fecha', 'fechaFin', 'hora', 'ubicacion', 'estado', 'imagen', 'precio', 'autor', 'descripcion', 'enlace', 'organizador', 'horaFin')
            ->with(['categorias:id,sigla'])
            ->when($nombre, function ($query, $nombre) {
                return $query->where('nombre', 'like', '%' . $nombre . '%');
            })
            ->where('estado', 'A')
            ->get();

        return response()->json($eventos);
    }


    //Para sacar el resumen de los eventos que estan publicados
    /* public function resumen($autor)
    {
        if ($autor === 'admin') {
            $total = Evento::count();
            $activos = Evento::where('estado', 'A')->count();
            $pendientes = Evento::where('estado', 'P')->count();
            $denegados = Evento::where('estado', 'D')->count();
        } else {
            $total = Evento::where('autor', $autor)->count();
            $activos = Evento::where('estado', 'A')->where('autor', $autor)->count();
            $pendientes = Evento::where('estado', 'P')->where('autor', $autor)->count();
            $denegados = Evento::where('estado', 'D')->where('autor', $autor)->count();
        }

        return response()->json([
            'total' => $total,
            'activos' => $activos,
            'pendientes' => $pendientes,
            'denegados' => $denegados
        ]);
    } */

    //Para sacar los eventos pendientes, aprobados, denegados
    public function dashboardData(Request $request)
    {

        
        $usuario = $request->user();

        if ($usuario->hasRole('admin')) {
            $eventos = Evento::orderBy('created_at', 'desc')->get();
        } else {
            $eventos = Evento::where('user_id', $usuario->id)
                             ->orderBy('created_at', 'desc')
                             ->get();
        }
        
        $resumen = [
            'total' => $eventos->count(),
            'activos' => $eventos->where('estado', 'A')->count(),
            'pendientes' => $eventos->where('estado', 'P')->count(),
            'denegados' => $eventos->where('estado', 'D')->count(),
        ];



        return response()->json([
            'resumen' => $resumen,
            'eventos' => $eventos,
            'empresas' => User::role('empresa')->get(),
        ]);
    }
}
