<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    public $timestamps = false; // Désactivé si absent de la migration

    protected $fillable = [
        'festival_id', 
        'nom', 
        'categorie', 
        'prix', 
        'stock'
    ];

    public function festival()
    {
        return $this->belongsTo(Festival::class, 'festival_id', 'id');
    }
}