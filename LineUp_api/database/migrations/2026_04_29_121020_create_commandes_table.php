<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            
            // Clé étrangère vers le festival (Doit être en VARCHAR/String !)
            $table->string('festival_id');
            $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');
            
            // Clé étrangère vers le festivalier (client)
            $table->foreignId('festivalier_id')->constrained('festivaliers')->onDelete('cascade');
            
            // Données de la commande
            $table->decimal('montant_total', 8, 2)->default(0);
            $table->string('statut')->default('payée'); // Ex: en attente, payée, annulée
            
            // $table->timestamps(); // Souvent utile pour garder la date exacte de la commande
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};