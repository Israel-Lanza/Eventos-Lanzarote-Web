<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::create('eventos_categorias', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('evento_id')
                ->constrained('eventos') 
                ->onDelete('cascade');
        
            $table->foreignId('categoria_id')
                ->constrained('categorias')
                ->onDelete('cascade');
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('eventos_categorias');
    }
};
