<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetMailable;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Mail\VerificacionEmailMailable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;



class UserController extends Controller
{
    public function index()
    {
        $usuarios = User::select('id', 'nombre', 'email', 'cif')
            ->where('id', '!=', User::orderBy('id')->first()->id)
            ->paginate(5);

        return response()->json($usuarios);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No se encontró ningún usuario con ese email.'], 404);
        }

        $token = Str::random(60);

        $frontendUrl = "http://localhost:5173";
        $url = $frontendUrl . "/reset-password?token=$token&email=" . urlencode($user->email);

        Mail::to($user->email)->send(new PasswordResetMailable($url, $user->nombre));

        return response()->json(['message' => 'Correo de recuperación enviado correctamente.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No se encontró ningún usuario con ese email.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'    => 'required|string|max:200',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:8',
            'cif'       => ['required', 'string', 'max:9', 'regex:/^([0-9]{8}[A-Z]|[A-Z][0-9]{7}[A-Z0-9])$/'],
        ], [
            'nombre.required'   => 'El nombre es obligatorio.',
            'email.required'    => 'El correo electrónico es obligatorio.',
            'email.unique'      => 'Este correo ya está en uso.',
            'password.required' => 'La contraseña es obligatoria.',
            'cif.required'      => 'El número de identificación es obligatorio.',
            'cif.max'           => 'El número de identificación no puede tener más de 9 caracteres.',
            'cif.regex'         => 'El número de identificación debe tener un formato válido (Ej: A1234567Z).',
        ]);


        $user = new User();
        $user->nombre = $request->nombre;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->cif = $request->cif;

        $user->save();
        $user->assignRole('empresa');

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );

        Mail::to($user->email)->send(new VerificacionEmailMailable($user, $url));
        return response()->json([
            'message' => 'Usuario registrado correctamente.',
            'verificacion_url' => $url,
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'cif' => $user->cif,
                'roles' => $user->getRoleNames(),
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user(); // usuario logueado

        $request->validate([
            'nombre'    => 'string|max:200',
            'email'     => 'email|unique:users,email,' . $user->id,
            'password'  => 'nullable|string|min:8',
            'cif'       => ['required', 'string', 'max:9', 'regex:/^([0-9]{8}[A-Z]|[A-Z][0-9]{7}[A-Z0-9])$/'],
        ], [
            'nombre.string' => 'El nombre debe ser una cadena de texto.',
            'nombre.max' => 'El nombre no puede tener más de 200 caracteres.',
            'email.email' => 'El formato del correo no es válido.',
            'email.unique' => 'Este correo ya está en uso.',
            'password.string' => 'La contraseña debe ser una cadena de texto.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'cif.required' => 'El número de identificación es obligatorio.',
            'cif.max' => 'El número de identificación no puede tener más de 9 caracteres.',
            'cif.regex' => 'El número de identificación debe tener un formato válido (Ej: A1234567Z).',
        ]);

        $user->nombre = $request->nombre ?? $user->nombre;
        $user->email = $request->email ?? $user->email;
        $user->cif = $request->cif ?? $user->cif;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'mensaje' => 'Perfil actualizado correctamente',
            'user' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'cif' => $user->cif,
                'roles' => $user->getRoleNames(),
            ],
        ]);
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
            'cif'       => ['required', 'string', 'max:9', 'regex:/^([0-9]{8}[A-Z]|[A-Z][0-9]{7}[A-Z0-9])$/'],
        ], [
            'nombre.string'         => 'El nombre debe ser una cadena de texto.',
            'nombre.max'            => 'El nombre no puede tener más de 200 caracteres.',

            'email.email'           => 'El formato del correo no es válido.',
            'email.unique'          => 'Este correo ya está en uso.',

            'password.string'       => 'La contraseña debe ser una cadena de texto.',
            'password.min'          => 'La contraseña debe tener al menos 8 caracteres.',

            'cif.required'          => 'El número de identificación es obligatorio.',
            'cif.max'               => 'El número de identificación no puede tener más de 9 caracteres.',
            'cif.regex'             => 'El número de identificación debe tener un formato válido (Ej: A1234567Z).',
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
