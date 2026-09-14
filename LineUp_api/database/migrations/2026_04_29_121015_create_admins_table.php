<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id(); // ID classique auto-incrémenté
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('password'); // Standard Laravel (au lieu de mot_de_passe)
            $table->string('role')->default('Admin'); // Pour ton SuperAdmin
            
            // $table->timestamps(); // Optionnel : à décommenter si tu veux created_at / updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};