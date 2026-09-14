<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            
            // Clé étrangère vers le festival (en VARCHAR/String)
            $table->string('festival_id');
            $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');
            
            // Clé étrangère vers le festivalier qui écrit l'avis
            $table->foreignId('festivalier_id')->constrained('festivaliers')->onDelete('cascade');
            
            // Clé étrangère vers l'artiste (nullable, car l'avis peut concerner le festival en général)
            $table->foreignId('artiste_id')->nullable()->constrained('artistes')->onDelete('cascade');
            
            // Le contenu de l'avis
            $table->integer('note'); // ex: de 1 à 5
            $table->text('commentaire')->nullable();
            
            $table->timestamps(); // Indispensable ici pour trier les avis par date !
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};