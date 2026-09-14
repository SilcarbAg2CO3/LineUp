<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lieux', function (Blueprint $table) {
            $table->id();
            // On utilise string pour correspondre au VARCHAR(191) de festivals
            $table->string('festival_id'); 
            $table->string('nom');
            $table->string('type', 50)->nullable();
            $table->decimal('pos_x', 5, 2)->nullable();
            $table->decimal('pos_y', 5, 2)->nullable();
            
            // La clé étrangère gérée proprement par Laravel
            $table->foreign('festival_id')->references('id')->on('festivals')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('lieux');
    }
};