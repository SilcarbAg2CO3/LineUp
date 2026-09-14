<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Festivalier extends Authenticatable
{
    use HasApiTokens;

    protected $guarded = [];
    public $timestamps = false;

    // SÉCURITÉ : Masque ces champs lors des renvois JSON
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    public function billets(): HasMany
    {
        return $this->hasMany(Billet::class);
    }

    public function casiers(): HasMany
    {
        return $this->hasMany(Casier::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }
}