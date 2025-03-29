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
        /*DB::table('users')->insert([
            'nombre' => 'admin',
            'email' => 'eventoslanzarote@eventoslanzarote.es',
            'password' => Hash::make('9Lmk@3Jk1P'),
        ]);*/


        //Roles para admin y empresas, admin tiene todos las posibilidades y empresas restringido
        $admin   = Role::create(['name' => 'admin']);
        $empresa = Role::create(['name' => 'empresa']);

        $user = User::find(1);
        $user->assignRole($admin);
    }
}
