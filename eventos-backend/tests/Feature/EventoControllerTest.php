<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Evento;
use App\Models\User;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class EventoControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_retorna_eventos_activados()
    {
        Evento::factory()->create([
            'estado' => 'A',
            'fecha' => now()->addDays(2),
        ]);

        Evento::factory()->create([
            'estado' => 'D',
            'fecha' => now()->addDays(2),
        ]);

        $response = $this->getJson('/api/eventos');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data']);
        $this->assertCount(1, $response->json('data'));
    }


    public function test_store_crea_evento_correctamente()
    {
        Role::firstOrCreate(['name' => 'empresa']);

        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $user->assignRole('empresa');

        $payload = [
            'nombre' => 'Concierto de prueba',
            'descripcion' => 'Evento musical al aire libre',
            'fecha' => now()->addDays(5)->toDateString(),
            'ubicacion' => 'Plaza Mayor',
            'enlace' => 'https://example.com',
            'precio' => 15.5,
            'fechaFin' => now()->addDays(6)->toDateString(),
            'hora' => '19:00',
            'horaFin' => '22:00',
            'organizador' => 'Organización X',
            'categorias' => ['MU'],
        ];

        $this->actingAs($user)
            ->post('/api/eventos', $payload)
            ->assertStatus(201)
            ->assertJsonFragment(['mensaje' => 'Evento creado correctamente']);

        $this->assertDatabaseHas('eventos', [
            'nombre' => 'Concierto de prueba',
            'descripcion' => 'Evento musical al aire libre',
        ]);
    }
}
