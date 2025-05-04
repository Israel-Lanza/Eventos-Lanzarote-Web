<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Evento; 


class EventoFactory extends Factory
{
    protected $model = Evento::class; 

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->sentence,
            'descripcion' => $this->faker->paragraph,
            'fecha' => now()->addDays(rand(1, 30)),
            'ubicacion' => $this->faker->city,
            'precio' => $this->faker->randomFloat(2, 0, 100),
            'estado' => 'A',
            'autor' => 'Test Author',
            'user_id' => User::factory(),
        ];
    }
}

