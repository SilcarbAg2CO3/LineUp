<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Billet extends Model {
    protected $guarded = [];
    public $timestamps = false;

    public function festival() {
        return $this->belongsTo(Festival::class);
    }

    public function festivalier() {
        return $this->belongsTo(Festivalier::class);
    }
}