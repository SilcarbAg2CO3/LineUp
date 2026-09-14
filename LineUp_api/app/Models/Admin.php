<?php

// app/Models/Admin.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable 
{
    use HasApiTokens;
    
    public $timestamps = false;
    protected $guarded = [];

    // Masque ces champs critiques lors des requêtes JSON
    protected $hidden = [
        'mot_de_passe', 
        'remember_token',
    ];
}