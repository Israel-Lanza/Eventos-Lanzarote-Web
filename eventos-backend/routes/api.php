<?php

use App\Http\Controllers\AutenticationController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

//Ruta para el login (visualizacion del login)
Route::post('/login', [AutenticationController::class, 'login']);
Route::post('/empresas', [UserController::class, 'store']);

//Ruta para el deslogearse (tiene que estar autenticado para deslogearse)
Route::post('/logout', [AutenticationController::class, 'logout'])->middleware('auth:sanctum');

//Email de verificación
Route::get('/verificar-email/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Enlace de verificación inválido.'], 403);
    }

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return redirect(env('FRONTEND_URL') . '/login');
})->name('verification.verify');



//Rutas para eventos en el INDEX
Route::get('/eventos', [EventoController::class, 'index']);//Listar eventos INDEX
Route::get('/eventos/buscar', [EventoController::class, 'buscarPorNombre']);
Route::get('/eventos/{nombre}', [EventoController::class, 'show']); //Mostrar un evento INDEX
Route::get('/eventos/categoria/{categoria}', [EventoController::class, 'filtrarPorCategoria']); //Filtrar por categoría INDEX

//Rutas para eventos en el DASHBOARD de Admin y Empresa 
Route::middleware(['auth:sanctum', 'role:admin|empresa'])->group(function () {
    Route::get('/eventos/all/{autor}', [EventoController::class, 'getAllEvents']);//Listar todos los eventos (ADMIN // EMPRESA)
    Route::post('/eventos', [EventoController::class, 'store']); //Crear un evento DASHBOARD (ROL ADMIN/EMPRESA)
    Route::put('/eventos/{id}', [EventoController::class, 'update']); //Actualizar evento DASHBOARD (ROL ADMIN/EMPRESA)
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']); //Eliminar evento DASHBOARD (ROL ADMIN/EMPRESA)
    //Route::get('/eventos/resumen/{autor}', [EventoController::class, 'resumen']);
    Route::get('/dashboard-data', [EventoController::class, 'dashboardData']);//Que se muestre el dashboard para todos los usuarios
});


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Rutas para gestión de empresas (Usuarios)
    Route::get('/empresas', [UserController::class, 'index']); //Mostrar los datos de las empresas para rol ADMIN
/*     Route::post('/empresas', [UserController::class, 'store']); //Crear un usuario (empresa) para rol ADMIN
 */    Route::put('/empresas/{id}', [UserController::class, 'update']); //Actualizar los datos del usuario (empresa) para rol ADMIN
    Route::delete('/empresas/{id}', [UserController::class, 'destroy']); //Eliminar usuario (empresa) DASHBOARD para rol ADMIN

    //Cambiar estado del evento DASHBOARD (ROL ADMIN)
    Route::patch('/eventos/{id}/estado', [EventoController::class, 'cambiarEstado']);

});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {//Sirve para RutasProtegidas.jsx
    $user = $request->user();
    $user->roles = $user->getRoleNames(); //Importante para mostrar roles en frontend

    return response()->json([
        'id' => $user->id,
        'nombre' => $user->nombre,
        'email' => $user->email,
        'roles' => $user->roles
    ]);
});

