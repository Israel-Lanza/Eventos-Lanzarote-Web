<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;


class UserController extends Controller
{
    public function index()
    {
        $usuarios = User::select('id', 'nombre', 'email', 'cif')
            ->where('id', '!=', User::orderBy('id')->first()->id)
            ->paginate(5);

        return response()->json($usuarios);
    }

    /*public function show($id)
    {
        $usuario = User::select('id', 'nombre', 'email', 'cif')
            ->where('id', $id)
            ->first();

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }*/

    public function store(Request $request)
    {
        $request->validate([
            'nombre'    => 'required|string|max:200',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:8',
            'cif'       => 'required|max:9|regex:/^[A-Z]\d{7}[A-Z0-9]$/',
        ]);

        $user = new User();
        $user->nombre = $request->nombre;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->cif = $request->cif;

        $user->save();
        $user->assignRole('empresa');


        return response()->json(['mensaje' => 'Usuario creado correctamente', 'usuario' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'nombre'    => 'string|max:200',
            'email'     => 'email|unique:users,email,' . $id,
            'password'  => 'nullable|string|min:8',
            'cif'       => 'required|max:9|regex:/^[A-Z]\d{7}[A-Z0-9]$/',
        ]);

        $user->nombre = $request->nombre ?? $user->nombre;
        $user->email = $request->email ?? $user->email;
        $user->cif = $request->cif ?? $user->cif;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['mensaje' => 'Usuario actualizado correctamente', 'usuario' => $user]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['mensaje' => 'Usuario eliminado correctamente']);
    }
}
