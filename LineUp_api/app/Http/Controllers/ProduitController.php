<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    // GET /api/admin/festivals/{id}/produits
    public function index($festival_id)
    {
        return response()->json(Produit::where('festival_id', $festival_id)->get());
    }

    // Récupérer un produit spécifique (GET /api/admin/produits/{id})
    public function show($id)
    {
        return response()->json(Produit::findOrFail($id));
    }

    // Mettre à jour un produit (PUT /api/admin/produits/{id})
    public function update(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);

        $data = $request->validate([
            'nom' => 'required|string',
            'categorie' => 'required|string',
            'prix' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        $produit->update($data);

        return response()->json($produit);
    }

    // POST /api/admin/festivals/{id}/produits
    public function store(Request $request, $festival_id)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'categorie' => 'required|string',
            'prix' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        $data['festival_id'] = $festival_id;

        $produit = Produit::create($data);
        return response()->json($produit, 201);
    }

    // DELETE /api/admin/produits/{id}
    public function destroy($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }
}