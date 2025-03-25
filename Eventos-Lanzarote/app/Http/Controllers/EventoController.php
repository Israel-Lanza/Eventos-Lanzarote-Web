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
        $eventos = Evento::select('id', 'nombre', 'fecha', 'hora', 'ubicacion', 'estado', 'imagen', 'precio')
            ->with(['categorias:id,sigla'])
            ->where('estado', 'A')
            ->get();

        return response()->json($eventos);
    }

    public function show($id)
    {
        $evento = Evento::select('id', 'nombre', 'imagen', 'ubicacion', 'fecha', 'precio', 'hora', 'descripcion', 'enlace')
            ->where('id', $id)
            ->first();

        if (!$evento) {
            return response()->json(['error' => 'Evento no encontrado'], 404);
        }

        return response()->json($evento);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'        => 'required|string|max:200',
            'descripcion'   => 'required',
            'fecha'         => 'required|after:today',
            'hora'          => 'required|date_format:H:i',
            'ubicacion'     => 'required',
            'enlace'        => 'nullable|url',
            'precio'        => 'required|min:0|numeric',
            'imagen'        => 'nullable|image|max:2048',
        ]);

        $evento = new Evento();
        $evento->nombre = $request->nombre;
        $evento->descripcion = $request->descripcion;
        $evento->fecha = $request->fecha;
        $evento->hora = $request->hora;
        $evento->ubicacion = $request->ubicacion;
        $evento->enlace = $request->enlace;
        $evento->precio = $request->precio;
        $evento->autor = Auth::user()->nombre;

        if ($request->hasFile('imagen')) {
            $nombreImagen = str_replace(' ', '', $request->nombre . '.' . $request->file('imagen')->getClientOriginalExtension());
            $path = $request->file('imagen')->storeAs('imgEventos', $nombreImagen);
            $evento->imagen = Storage::url("/" . $path);
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
        ]);

        $evento->update($request->all());

        if ($request->hasFile('imagen')) {
            $nombreImagen = str_replace(' ', '', $request->nombre . '.' . $request->file('imagen')->getClientOriginalExtension());
            $path = $request->file('imagen')->storeAs('imgEventos', $nombreImagen);
            $evento->imagen = Storage::url("/" . $path);
        }

        return response()->json(['mensaje' => 'Evento actualizado correctamente', 'evento' => $evento]);
    }

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
}