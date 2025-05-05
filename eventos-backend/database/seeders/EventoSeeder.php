<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Evento;


class EventoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Evento::create([
            'user_id'     => 1,
            'nombre'      => 'Concierto en la Playa',
            'descripcion' => 'Un evento musical al aire libre con bandas locales.',
            'fecha'       => '2025-06-10',
            'fechaFin'    => '2025-06-10',
            'hora'        => '20:00',
            'horaFin'     => '23:30',
            'ubicacion'   => 'Playa Grande, Puerto del Carmen',
            'enlace'      => 'https://ejemplo.com/concierto-playa',
            'imagen'      => '/imgEventos/concierto.jpg',
            'precio'      => 0.00,
            'estado'      => 'P',
            'autor'       => 'Israel Betancor',
            'organizador' => 'Ayuntamiento de Tías',
        ]);

        Evento::create([
            'user_id'     => 1,
            'nombre'      => 'Feria de Artesanía',
            'descripcion' => 'Exposición de artesanos locales con talleres gratuitos.',
            'fecha'       => '2025-07-15',
            'fechaFin'    => '2025-07-17',
            'hora'        => '10:00',
            'horaFin'     => '18:00',
            'ubicacion'   => 'Arrecife - Recinto ferial',
            'enlace'      => null,
            'imagen'      => '/imgEventos/feria.jpg',
            'precio'      => 2.50,
            'estado'      => 'P', 
            'autor'       => 'Tania García',
            'organizador' => 'Cabildo de Lanzarote',
        ]);
    }
}
