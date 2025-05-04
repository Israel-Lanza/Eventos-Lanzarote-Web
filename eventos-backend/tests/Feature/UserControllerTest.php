<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Tests\TestCase;
use App\Mail\VerificacionEmailMailable;
use App\Mail\PasswordResetMailable;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_devuelve_usuarios()
    {
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);


        $admin = User::factory()->create();

        $admin->assignRole('admin');

        User::factory()->count(6)->create();


        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->getJson('/api/empresas');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    public function test_crea_usuario()
    {
        Mail::fake();

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

    public function test_actualiza_contraseña()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $payload = [
            'email' => $user->email,
            'token' => 'fake-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];

        $response = $this->postJson('/api/password/reset', $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Contraseña actualizada correctamente.']);
    }

    public function test_datos_usuario_autenticado()
    {
        Role::firstOrCreate(['name' => 'empresa', 'guard_name' => 'web']);
        /** @var \App\Models\User $user */
        $user = User::factory()->create();
        $user->assignRole('empresa');

        $response = $this->actingAs($user)->getJson('/api/user/profile');

        $response->assertStatus(200)
                 ->assertJsonStructure(['user' => ['id', 'nombre', 'email', 'cif', 'roles']]);
    }
}
