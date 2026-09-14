<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {

    public function login(Request $request) {
        // 1. Validation : 'required' est la règle, 'password' est la clé
        $request->validate([
            'email' => 'required|email',
            'password' => 'required', 
        ]);

        $admin = Admin::where('email', $request->email)->first();

        // 2. Utilise $request->password pour correspondre à la validation
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Identifiants incorrects ou problème de connexion.'], 401);
        }

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $admin
        ]);
    }

    public function me(Request $request)
{
    // Renvoie simplement l'utilisateur actuellement authentifié via le token
    return response()->json($request->user());
}

    public function updateProfil(Request $request)
{
    // On récupère l'admin connecté via le token
    $admin = $request->user();

    $request->validate([
        'prenom' => 'required|string|max:255',
        'nom' => 'required|string|max:255',
        'email' => 'required|email|unique:admins,email,' . $admin->id,
        'password' => 'nullable|min:6|confirmed', // 'confirmed' attend un champ password_confirmation
    ]);

    // Mise à jour des infos de base
    $admin->prenom = $request->prenom;
    $admin->nom = $request->nom;
    $admin->email = $request->email;

    // Mise à jour du mot de passe uniquement s'il est rempli
    if ($request->filled('password')) {
        $admin->password = Hash::make($request->password);
    }

    $admin->save();

    return response()->json([
        'message' => 'Profil mis à jour avec succès !',
        'user' => $admin
    ]);
}
}