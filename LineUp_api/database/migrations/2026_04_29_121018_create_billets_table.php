<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billets', function (Blueprint $table) {
            $table->id();
            
            // Clé étrangère vers le festival (en VARCHAR/String)
            $table->string('festival_id');
            $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');
            
            // Clé étrangère vers le festivalier (propriétaire du billet)
            $table->foreignId('festivalier_id')->nullable()->constrained('festivaliers')->onDelete('cascade');            
            // Détails du billet
            $table->string('type'); // Ex: Pass 1 Jour, Pass 3 Jours, VIP
            $table->decimal('prix', 8, 2);
            $table->string('code_barre')->unique(); // Indispensable pour le scan aux portes
            $table->string('statut')->default('valide'); // Ex: valide, scanné, annulé
            
            // $table->timestamps(); // Utile pour savoir quand le billet a été généré
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billets');
    }
};