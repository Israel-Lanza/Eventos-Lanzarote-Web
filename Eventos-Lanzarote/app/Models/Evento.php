<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    const ESTADOS = [
        'P' => 'Pendiente',
        'A' => 'Aprobado',
        'D' => 'Denegado'
    ];

    const MESES = [
        '01' => 'enero',
        '02' => 'febrero',
        '03' => 'marzo',
        '04' => 'abril',
        '05' => 'mayo',
        '06' => 'junio',
        '07' => 'julio',
        '08' => 'agosto',
        '09' => 'septiembre',
        '10' => 'octubre',
        '11' => 'noviembre',
        '12' => 'diciembre'
    ];


    public function categorias(){
        return $this->belongsToMany(Categoria::class, 'eventos_categorias');
    }
}