<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */

     public function test_registro()
    {
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'empresa']);

        $payload = [
            'nombre' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'cif' => 'A1234567Z',
        ];

        $response = $this->postJson('/api/empresas', $payload);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'verificacion_url']);
    }

    public function test_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now()
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'token',
                     'user' => ['id', 'nombre', 'email', 'roles']
                 ]);
    }

    public function test_logout()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Sesión cerrada correctamente']);
    }
}
