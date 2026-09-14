<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Festivalier;
use Illuminate\Support\Facades\Hash;

class FestivalierAuthController extends Controller {
    
    public function register(Request $request) {
        $request->validate([
            'email' => 'required|email|unique:festivaliers',
            'mot_de_passe' => 'required|min:6'
        ]);

        $festivalier = Festivalier::create([
            'email' => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'solde_cashless' => 50.00 // Montant initial
        ]);

        $token = $festivalier->createToken('mobile_token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $festivalier], 201);
    }

    public function login(Request $request) {
        $festivalier = Festivalier::where('email', $request->email)->first();
        
        if (!$festivalier || !Hash::check($request->mot_de_passe, $festivalier->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants incorrects.'], 401);
        }
        
        $token = $festivalier->createToken('mobile_token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $festivalier]);
    }

    // AJOUT : Méthode de déconnexion manquante
    public function logout(Request $request) {
        // Supprime uniquement le token actuel de l'appareil mobile
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function updateProfil(Request $request) {
        $festivalier = $request->user();
        
        $request->validate([
            'nom' => 'nullable|string',
            'prenom' => 'nullable|string',
            'telephone' => 'nullable|string',
            'date_naissance' => 'nullable|string',
            'email' => 'nullable|email|unique:festivaliers,email,' . $festivalier->id,
            'mot_de_passe_actuel' => 'required_with:nouveau_mot_de_passe', // Requis si on change le mot de passe
            'nouveau_mot_de_passe' => 'nullable|min:6'
        ]);

        // Vérification de sécurité pour le changement de mot de passe
        if ($request->filled('nouveau_mot_de_passe')) {
            if (!Hash::check($request->mot_de_passe_actuel, $festivalier->mot_de_passe)) {
                return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 400);
            }
            $festivalier->mot_de_passe = Hash::make($request->nouveau_mot_de_passe);
        }

        // Mise à jour des infos basiques
        $festivalier->update($request->except(['mot_de_passe', 'nouveau_mot_de_passe', 'mot_de_passe_actuel']));
        $festivalier->save(); // Nécessaire pour sauvegarder le nouveau mdp si modifié

        return response()->json(['message' => 'Profil mis à jour avec succès', 'user' => $festivalier]);
    }

    public function forgotPassword(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:festivaliers,email'
        ]);

        // La logique d'envoi d'email viendra ici plus tard
        return response()->json([
            'message' => 'Un email contenant les instructions de récupération a été envoyé.'
        ]);
    }
}