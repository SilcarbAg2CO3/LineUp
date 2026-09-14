<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('festivals', function (Blueprint $table) {
            // L'ID sera une chaîne (ex: summerside-2026)
            $table->string('id')->primary(); 
            $table->string('nom');
            $table->integer('annee');
            $table->string('lieu')->nullable();
            $table->string('statut')->default('En préparation ⏳');
            $table->string('couleur')->default('#F98C2F');
            // Pas de $table->timestamps() pour éviter les erreurs created_at si tu n'en as pas besoin
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('festivals');
    }
};