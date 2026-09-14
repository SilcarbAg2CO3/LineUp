<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Casier;
use Illuminate\Support\Facades\DB;

class CasierController extends Controller {
    
    public function reserver(Request $request) {
        $request->validate([
            'festival_id' => 'required|exists:festivals,id',
            'taille' => 'required|string',
            'prix' => 'required|numeric|min:0' // Sécurité : empêche les prix négatifs
        ]);

        $festivalier = $request->user();

        // Vérification du solde
        if ($festivalier->solde_cashless < $request->prix) {
            return response()->json(['message' => 'Solde cashless insuffisant.'], 400);
        }

        // Transaction sécurisée (on récupère le résultat de la transaction)
        $casier = DB::transaction(function () use ($festivalier, $request) {
            
            // 1. Débit du compte
            $festivalier->solde_cashless -= $request->prix;
            $festivalier->save();

            // 2. Création et retour du casier
            return Casier::create([
                'festival_id' => $request->festival_id,
                'festivalier_id' => $festivalier->id,
                'taille' => $request->taille,
                'zone' => 'Entrée Principale',
                'code_acces' => strtoupper(substr(uniqid(), -5)) // Code généré aléatoirement
            ]);
        });

        // On renvoie le casier complet pour que l'app mobile puisse afficher le code d'accès !
        return response()->json([
            'message' => 'Casier réservé !',
            'nouveau_solde' => $festivalier->solde_cashless,
            'casier' => $casier
        ], 201);
    }
}