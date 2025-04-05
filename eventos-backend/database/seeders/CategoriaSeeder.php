<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['sigla' => 'MU'],
            ['sigla' => 'TL'],
            ['sigla' => 'EX'],
            ['sigla' => 'GA'],
            ['sigla' => 'IN'],
            ['sigla' => 'TR'],
            ['sigla' => 'FE'],
            ['sigla' => 'AE'],
            ['sigla' => 'DE'],
        ]);
    }
}
