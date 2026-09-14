<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Concert extends Model
{
    protected $table = 'artistes';

    public $timestamps = false; // Désactive si tu n'as pas created_at/updated_at dans ta table

    protected $fillable = [
        'festival_id', 
        'nom', 
        'jour', 
        'heure', 
        'scene', 
        'statut'
    ];

    public function avis() {
    return $this->hasMany(Avis::class);
}
}