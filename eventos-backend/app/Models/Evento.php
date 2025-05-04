<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Evento extends Model
{
    use HasFactory;

    const ESTADOS = [
        'P' => 'Pendiente',
        'A' => 'Aprobado',
        'D' => 'Denegado'
    ];


    public function categorias(){
        return $this->belongsToMany(Categoria::class, 'eventos_categorias');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}