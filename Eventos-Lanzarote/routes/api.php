<?php

use App\Http\Controllers\EventoController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/usuarios', function () {
    $users = User::all();
    return response()->json($users);
});

Route::get('/eventos', [EventoController::class, 'index']);  // Listar eventos
Route::get('/eventos/{id}', [EventoController::class, 'show']); // Mostrar un evento
Route::post('/eventos', [EventoController::class, 'store']); // Crear un evento
Route::put('/eventos/{id}', [EventoController::class, 'update']); // Actualizar evento
Route::delete('/eventos/{id}', [EventoController::class, 'destroy']); // Eliminar evento
Route::get('/eventos/categoria/{categoria}', [EventoController::class, 'filtrarPorCategoria']); // Filtrar por categoría
Route::patch('/eventos/{id}/estado', [EventoController::class, 'cambiarEstado']); // Cambiar estado del evento
