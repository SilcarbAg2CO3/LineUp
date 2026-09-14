<?php

// app/Models/Artiste.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artiste extends Model 
{
    public $timestamps = false;
    
    // Autorise Laravel à enregistrer les données envoyées par React
    protected $guarded = []; 

    public function concerts() { 
        return $this->hasMany(Concert::class);
    } 
    public function avis()
    {
        return $this->hasMany(Avis::class, 'concert_id'); 
    }
}