<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Festival extends Model
{
    // CONFIGURATION CLÉ PRIMAIRE TEXTE
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    
    // DÉSACTIVATION TIMESTAMPS (car absents de la migration)
    public $timestamps = false;

    // AUTORISATION DES CHAMPS
    protected $fillable = ['id', 'nom', 'annee', 'lieu', 'statut', 'couleur', 'plan_image'];

    /**
     * Relation avec les artistes (qui servent de concerts dans ta structure)
     */
    public function concerts(): HasMany
    {
        return $this->hasMany(Artiste::class, 'festival_id', 'id');
    }
}