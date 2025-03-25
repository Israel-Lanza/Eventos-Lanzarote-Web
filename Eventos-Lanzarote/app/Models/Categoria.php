<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    const CATEGORIAS = [
        'MU' => 'Musicales',
        'TL' => 'Talleres, cursos y conferencias',
        'EX' => 'Exposiciones',
        'GA' => 'Gastronómicos',
        'IN' => 'Infantiles',
        'TR' => 'Tradicionales',
        'FE' => 'Ferias, galas y festivales',
        'AE' => 'Artes Escénicas',
        'DE' => 'Deportivos'
    ]; 



    public function eventos(){
        return $this->belongsToMany(Evento::class, 'eventos_categorias');
    }
}