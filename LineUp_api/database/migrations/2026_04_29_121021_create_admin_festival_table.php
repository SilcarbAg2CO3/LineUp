<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_festival', function (Blueprint $table) {
            $table->id();
            
            // 1. Clé étrangère pour l'admin (Entier classique)
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            
            // 2. Clé étrangère pour le festival (Doit être en VARCHAR/String !)
            $table->string('festival_id');
            $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');
            
            // $table->timestamps(); // Optionnel
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_festival');
    }
};