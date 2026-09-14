<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Avis extends Model {
    protected $table = 'avis'; // Sécurité anti-pluralisateur
    protected $guarded = [];
    public $timestamps = false;

    public function concert() {
        return $this->belongsTo(Concert::class);
    }

    public function festivalier() {
        return $this->belongsTo(Festivalier::class);
    }

    
    public function artiste()
    {
        return $this->belongsTo(Artiste::class, 'concert_id');
    }
}