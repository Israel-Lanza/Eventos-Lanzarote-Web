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
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion');
            $table->string('fecha');
            $table->string('fechaFin');
            $table->string('hora'); 
            $table->string('ubicacion');
            $table->string('enlace')->nullable();
            $table->string('imagen')->nullable();
            $table->decimal('precio',8, 2);
            $table->char('estado',1)->default('P');
            $table->string('autor');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
