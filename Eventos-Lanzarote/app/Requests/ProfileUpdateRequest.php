<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado a realizar esta solicitud.
     *
     * @return bool
     */
    public function authorize()
    {
        // Asume que el usuario está autorizado a actualizar su perfil
        return true;
    }

    /**
     * Obtén las reglas de validación que se aplicarán a la solicitud.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $this->user()->id,
            // Puedes añadir más reglas según lo que necesites para la actualización del perfil
        ];
    }
}
