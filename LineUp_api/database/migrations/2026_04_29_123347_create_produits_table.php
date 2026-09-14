<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
    $table->string('festival_id'); // Doit être string pour matcher "test-2026"
    $table->string('nom');
    $table->string('categorie');
    $table->decimal('prix', 8, 2);
    $table->integer('stock');
    
    // Optionnel : lier proprement à la table festivals
    $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');});
    }

    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};