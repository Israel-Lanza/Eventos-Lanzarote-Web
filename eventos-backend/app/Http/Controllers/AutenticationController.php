<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AutenticationController extends Controller
{
    //Para verificar los usuarios que se pueden logear si existen en la base de datos y creacion del token personal para cada usuario
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'No ha introducido ningun nombre',
            'email.email'    => 'Debe ser un email real',

            'password.required' => 'No ha introducido ninguna contraseña',
        ]);

        $user = User::where('email', $request->email)->whereNotNull('email_verified_at')->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        
        $user->roles = $user->getRoleNames();

        return response()->json([
        'token' => $token,
        'user' => [
            'id'    => $user->id,
            'nombre'=> $user->nombre,
            'email' => $user->email,
            'roles' => $user->roles
            ]
        ], 200);

    }

    //Desconexion del usuario que será la petición a través de un botón y destrucción del token (no pasa nada ya que se genera otro token para el mismo usuario si entra luego)
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
    }
}
