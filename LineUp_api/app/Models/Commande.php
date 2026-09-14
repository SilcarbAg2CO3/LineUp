<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    // Indique à Laravel que la table s'appelle bien "commandes"
    protected $table = 'commandes';

    // On désactive la colonne updated_at car elle n'existe pas dans ta table
    const UPDATED_AT = null;

    // Les colonnes modifiables (Best practice : protection contre le mass-assignment)
    protected $fillable = [
        'festival_id',
        'festivalier_id',
        'numero_commande',
        'montant_total',
        'statut',
        'created_at'
    ];

    // Relation : une commande appartient à un festival
    public function festival()
    {
        return $this->belongsTo(Festival::class);
    }
}