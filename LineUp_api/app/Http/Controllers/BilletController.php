<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Billet;

class BilletController extends Controller {
    
    // Associer un billet (AjouterBilletScreen)
    public function associer(Request $request) {
        $request->validate(['code_billet' => 'required|string']);

        // On cherche le billet dans la base
        $billet = Billet::where('code_billet', $request->code_billet)->first();

        if (!$billet) {
            return response()->json(['message' => 'Billet introuvable.'], 404);
        }
        if ($billet->festivalier_id) {
            return response()->json(['message' => 'Ce billet est déjà associé à un compte.'], 400);
        }

        // On l'associe à l'utilisateur connecté
        $billet->festivalier_id = $request->user()->id;
        $billet->save();

        return response()->json(['message' => 'Billet ajouté avec succès !', 'billet' => $billet]);
    }

    // Afficher les billets du festivalier (BilletScreen)
    public function mesBillets(Request $request) {
        // On charge aussi le festival lié pour l'affichage
        $billets = Billet::with('festival')
                    ->where('festivalier_id', $request->user()->id)
                    ->get();
                    
        return response()->json($billets);
    }
}