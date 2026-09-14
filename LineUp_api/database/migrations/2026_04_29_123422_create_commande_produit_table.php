<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commande_produit', function (Blueprint $table) {
            $table->id(); 
            
            // Les clés étrangères (doivent correspondre aux tables commandes et produits)
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
            
            // Les informations spécifiques à cette ligne de commande
            $table->integer('quantite')->default(1);
            
            // $table->timestamps(); // Optionnel
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commande_produit');
    }
};