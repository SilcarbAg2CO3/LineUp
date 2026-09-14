<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('festivaliers', function (Blueprint $table) {
            $table->id(); 
            $table->string('nom');
            $table->string('prenom')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            
            // Portefeuille virtuel (très standard pour les festivals)
            $table->decimal('solde_cashless', 8, 2)->default(0); 
            
            // $table->timestamps(); // Décommente si tu veux garder les dates d'inscription
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('festivaliers');
    }
};