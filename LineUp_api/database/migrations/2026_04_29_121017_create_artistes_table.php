<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artistes', function (Blueprint $table) {
            $table->id();
            
            // Clé étrangère vers le festival (en VARCHAR/String)
            $table->string('festival_id');
            $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');
            
            // Infos de l'artiste et de son concert (basé sur ton composant React)
            $table->string('nom'); // ou 'artiste' selon ton modèle
            $table->string('jour')->nullable();
            $table->string('heure')->nullable();
            $table->string('scene')->nullable();
            $table->string('statut')->default('En attente');
            
            // $table->timestamps(); // Optionnel
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artistes');
    }
};