<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'nombre' => 'admin',
            'email' => 'eventoslanzarote@eventoslanzarote.es',
            'password' => Hash::make('9Lmk@3Jk1P'),
            'cif' => 'P989898'
        ]);

        DB::table('users')->insert([
            'nombre' => 'empresa1',
            'email' => 'empresa@eventoslanzarote.es',
            'password' => Hash::make('entrar1234'),
            'cif' => 'P7878787'
        ]);

        //Roles para admin y empresas, admin tiene todos las posibilidades y empresas restringido
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'empresa']);

        $user = User::find(1);
        $user->assignRole('admin');

        $user = User::find(2);
        $user->assignRole('empresa');
    }
}
