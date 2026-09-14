<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('casiers', function (Blueprint $table) {
            $table->id();
            
            // Clé étrangère vers le festival (en VARCHAR/String)
            $table->string('festival_id');
            $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');
            
            // Clé étrangère vers le festivalier qui le loue (nullable car un casier peut être vide)
            $table->foreignId('festivalier_id')->nullable()->constrained('festivaliers')->onDelete('set null');
            
            // Caractéristiques du casier
            $table->string('numero'); // Ex: A-01, B-42
            $table->string('taille')->default('standard'); // Ex: petit, standard, grand
            $table->string('statut')->default('disponible'); // Ex: disponible, loué, maintenance
            
            // $table->timestamps(); // Optionnel
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('casiers');
    }
};