<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EventoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eventos = [
            [
                'nombre' => 'Concierto de Rock',
                'descripcion' => 'Un espectacular concierto de rock en vivo con bandas locales.',
                'fecha' => '2025-04-10',
                'fechaFin'  => '2025-05-15',
                'hora' => '20:00',
                'ubicacion' => 'Estadio Nacional',
                'enlace' => 'https://example.com/concierto-rock',
                'imagen' => 'concierto_rock.jpg',
                'precio' => 50.00,
                'estado' => 'A',
                'autor' => 'admin'
            ],
            [
                'nombre' => 'Taller de Fotografía',
                'descripcion' => 'Aprende técnicas avanzadas de fotografía con expertos.',
                'fecha' => '2025-05-15',
                'fechaFin'  => '2025-05-15',
                'hora' => '09:00',
                'ubicacion' => 'Centro Cultural',
                'enlace' => 'https://example.com/taller-fotografia',
                'imagen' => 'taller_fotografia.jpg',
                'precio' => 30.00,
                'estado' => 'A',
                'autor' => 'admin'
            ],
            [
                'nombre' => 'Exposición de Arte Moderno',
                'descripcion' => 'Descubre obras únicas de artistas contemporáneos.',
                'fecha' => '2025-06-20',
                'fechaFin'  => '2025-05-15',
                'hora' => '10:00',
                'ubicacion' => 'Museo de Arte Moderno',
                'enlace' => 'https://example.com/exposicion-arte',
                'imagen' => 'expo_arte.jpg',
                'precio' => 15.00,
                'estado' => 'A',
                'autor' => 'admin'
            ],
        ];

        foreach ($eventos as $evento) {
            $eventoId = DB::table('eventos')->insertGetId($evento);

            // Asignar categorías al evento aleatoriamente
            $categorias = DB::table('categorias')->inRandomOrder()->take(rand(1, 3))->pluck('id');

            foreach ($categorias as $categoriaId) {
                DB::table('eventos_categorias')->insert([
                    'evento_id' => $eventoId,
                    'categoria_id' => $categoriaId,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}