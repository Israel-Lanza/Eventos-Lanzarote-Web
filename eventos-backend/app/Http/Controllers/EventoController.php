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

class EventoController extends Controller
{
    public function index()
    {
        $eventos = Evento::select('id', 'nombre', 'fecha', 'hora', 'ubicacion', 'estado', 'imagen', 'precio', 'autor', 'descripcion', 'enlace')
            ->with(['categorias:id,sigla'])
            ->where('estado', 'A')
            ->get();

        return response()->json($eventos);
    }

    //Para sacar todos los eventos sin tener en cuenta el estado
    public function getAllEvents($autor)
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
    }

    public function show($nombre)
    {
        $nombre = str_replace('-', ' ', $nombre);
        $evento = Evento::select('id', 'nombre', 'imagen', 'ubicacion', 'fecha', 'precio', 'hora', 'descripcion', 'enlace', 'autor')
            ->where('nombre', $nombre)
            ->first();

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
            'fecha'         => 'required|after:today',
            'fechaFin'      => 'nullable|date|after_or_equal:fecha',
            'hora'          => 'required|date_format:H:i',
            'ubicacion'     => 'required',
            'enlace'        => 'nullable|url',
            'precio'        => 'required|min:0|numeric',
            'imagen'        => 'nullable|image|max:2048',
        ], [
            'nombre.required'       => 'El nombre del evento es obligatorio.',
            'nombre.max'            => 'El nombre no puede tener más de 200 caracteres.',
            'descripcion.required'  => 'La descripción es obligatoria.',
            'fecha.required'        => 'La fecha es obligatoria.',
            'fecha.after'           => 'La fecha debe ser posterior a hoy.',
            'fechaFin.date'         => 'La fecha de fin debe ser una fecha válida.',
            'fechaFin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
            'hora.required'         => 'La hora es obligatoria.',
            'hora.date_format'      => 'La hora debe tener el formato HH:mm.',
            'ubicacion.required'    => 'La ubicación es obligatoria.',
            'enlace.url'            => 'El enlace debe ser una URL válida.',
            'precio.required'       => 'El precio es obligatorio.',
            'precio.numeric'        => 'El precio debe ser un número.',
            'precio.min'            => 'El precio no puede ser negativo.',
            'imagen.image'          => 'El archivo debe ser una imagen.',
            'imagen.max'            => 'La imagen no puede superar los 2MB.',
        ]);
        

        $evento = new Evento();
        $evento->nombre = $request->nombre;
        $evento->descripcion = $request->descripcion;
        $evento->fecha = $request->fecha;
        $evento->hora = $request->hora;
        $evento->ubicacion = $request->ubicacion;
        $evento->enlace = $request->enlace;
        $evento->precio = $request->precio;
        $evento->fechaFin = $request->fechaFin ?? null;
        $evento->autor = Auth::user()->nombre;

        if ($request->hasFile('imagen')) {
            $nombreImagen = str_replace(' ', '', $request->nombre . '.' . $request->file('imagen')->getClientOriginalExtension());
            $path = $request->file('imagen')->storeAs('imgEventos', $nombreImagen);
            $evento->imagen = Storage::url($path);
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
            'nombre'        => 'string|max:200',
            'descripcion'   => 'string',
            'fecha'         => 'date|after:today',
            'hora'          => 'date_format:H:i',
            'ubicacion'     => 'string',
            'enlace'        => 'nullable|url',
            'precio'        => 'numeric|min:0',
            'imagen'        => 'nullable|image|max:2048',
        ], [
            'nombre.string'        => 'El nombre debe ser una cadena de texto.',
            'nombre.max'           => 'El nombre no puede tener más de 200 caracteres.',
            'descripcion.string'   => 'La descripción debe ser texto.',
            'fecha.date'           => 'La fecha debe ser una fecha válida.',
            'fecha.after'          => 'La fecha debe ser posterior a hoy.',
            'hora.date_format'     => 'La hora debe tener el formato HH:mm.',
            'ubicacion.string'     => 'La ubicación debe ser una cadena de texto.',
            'enlace.url'           => 'El enlace debe ser una URL válida.',
            'precio.numeric'       => 'El precio debe ser un número.',
            'precio.min'           => 'El precio no puede ser negativo.',
            'imagen.image'         => 'El archivo debe ser una imagen válida.',
            'imagen.max'           => 'La imagen no puede superar los 2MB.',
        ]);

        $evento->nombre = $request->nombre ?? $evento->nombre;
        $evento->descripcion = $request->descripcion ?? $evento->descripcion;
        $evento->fecha = $request->fecha ?? $evento->fecha;
        $evento->hora = $request->hora ?? $evento->hora;
        $evento->ubicacion = $request->ubicacion ?? $evento->ubicacion;
        $evento->enlace = $request->enlace ?? $evento->enlace;
        $evento->precio = $request->precio ?? $evento->precio;

        if ($request->hasFile('imagen')) {
            $nombreImagen = str_replace(' ', '', $request->nombre . '.' . $request->file('imagen')->getClientOriginalExtension());
            $path = $request->file('imagen')->storeAs('imgEventos', $nombreImagen);
            $evento->imagen = Storage::url("/" . $path);
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

    public function filtrarPorCategoria($categoria)
    {
        $categoriaModel = Categoria::where('sigla', $categoria)->first();
        if (!$categoriaModel) {
            return response()->json(['error' => 'Categoría no encontrada'], 404);
        }

        $eventos = $categoriaModel->eventos()->where('estado', 'A')->get();
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

        $evento->estado = $request->estado;
        $evento->save();

        return response()->json(['mensaje' => 'Estado actualizado correctamente', 'evento' => $evento]);
    }


    //Para la busqueda filtrada por nombre
    public function buscarPorNombre(Request $request)
    {
        $nombre = $request->query('nombre');

        $eventos = Evento::select('id', 'nombre', 'fecha', 'hora', 'ubicacion', 'estado', 'imagen', 'precio', 'autor', 'descripcion', 'enlace')
            ->with(['categorias:id,sigla'])
            ->when($nombre, function ($query, $nombre) {
                return $query->where('nombre', 'like', '%' . $nombre . '%');
            })
            ->where('estado', 'A')
            ->get();

        return response()->json($eventos);
    }


    //Para sacar el resumen de los eventos que estan publicados
    public function resumen($autor)
    {
        if ($autor === 'admin') {
            $total = Evento::count();
            $activos = Evento::where('estado', 'A')->count();
            $pendientes = Evento::where('estado', 'P')->count();
        } else {
            $total = Evento::where('autor', $autor)->count();
            $activos = Evento::where('estado', 'A')->where('autor', $autor)->count();
            $pendientes = Evento::where('estado', 'P')->where('autor', $autor)->count();
        }

        return response()->json([
            'total' => $total,
            'activos' => $activos,
            'pendientes' => $pendientes
        ]);
    }
}
