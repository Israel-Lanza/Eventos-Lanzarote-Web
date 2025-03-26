<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{

    function listado()
    {
        $usuarios = User::select('id', 'nombre', 'email', 'cif')
        ->where('id', '!=', User::orderBy('id')->first()->id)->paginate(5);
        return view('usuarios.listado', compact('usuarios'));
    }


    function formulario($oper = '', $id = '')
    {
        $usuario = empty($id) ? new User() : User::find($id);

        return view('usuarios.formulario', compact('oper', 'usuario'));
    }

    function leer($id)
    {
        return $this->formulario('cons', $id);
    }

    function actualizar($id)
    {
        return $this->formulario('modi', $id);
    }

    function eliminar($id)
    {
        return $this->formulario('supr', $id);
    }

    function alta()
    {
        return $this->formulario();
    }

    function almacenar(Request $request)
    {
        if ($request->oper == 'supr') {

            $user = User::find($request->id);
            $user->delete();

            $salida = redirect()->route('usuarios.mostrar');
        } else {

            $request->validate([
                'nombre'               => 'required|string|max:200',
                'email'                => 'required|string',
                'password'             => 'required',
                'cif'                  => 'required|max:9|regex:/^[A-Z]\d{7}[A-Z0-9]$/',
            ], [
                'nombre.required'   => 'El nombre de la empresa es obligatorio.',
                'nombre.string'     => 'Debe ser de tipo cadena de texto.',
                'nombre.max'        => 'Máximo 255 caracteres',

                'email.required'    => 'El email es obligatorio.',
                'email.string'      => 'Debe ser de tipo cadena de texto.',

                'password.required' => 'La contraseña es obligatoria.',

                'cif.required'        => 'El CIF es obligatorio.',
                'cif.max'             => 'El CIF se comprende de 1 letra y 8 numeros.',

            ]);


            $user = empty($request->id) ? new User() : User::find($request->id);

            $user->nombre             = $request->nombre;
            $user->email              = $request->email;
            $user->password           = $request->password;
            $user->cif                = $request->cif;


            $user->save();

            $user->assignRole('empresa');

            if ($request->ajax()) {
                return response()->json([
                    'mensaje' => 'Usuario creado correctamente.',
                    'usuario'  => $user
                ]);
            }
        }
        return $salida;
    }

}