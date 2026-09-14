<?php
namespace App\Http\Controllers;
use App\Models\Avis;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    public function index($festival_id)
    {
        // On récupère tous les avis du festival, triés du plus récent au plus ancien
        $avis = Avis::where('festival_id', $festival_id)
                    ->orderBy('date', 'desc')
                    ->get();
                    
        return response()->json($avis);
    }
}