<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lieu extends Model
{
    // On précise le nom de la table au cas où
    protected $table = 'lieux';
    
    // Pas de colonnes created_at / updated_at dans ton SQL
    public $timestamps = false;

    // Les colonnes modifiables
    protected $fillable = [
        'festival_id', 
        'nom', 
        'type', 
        'pos_x', 
        'pos_y'
    ];

    // La relation : un lieu appartient à un festival
    public function festival()
    {
        return $this->belongsTo(Festival::class);
    }
}