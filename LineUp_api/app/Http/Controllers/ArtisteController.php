<?php
namespace App\Http\Controllers;

use App\Models\Artiste;
use Illuminate\Http\Request;

class ArtisteController extends Controller {
    
    public function index() {
        return response()->json(Artiste::all());
    }

    public function store(Request $request) {
        $request->validate(['nom' => 'required']);
        return response()->json(Artiste::create($request->all()), 201);
    }

    public function show($id) {
        return response()->json(Artiste::findOrFail($id));
    }

    public function update(Request $request, $id) {
        $artiste = Artiste::findOrFail($id);
        $artiste->update($request->all());
        return response()->json($artiste);
    }

    public function destroy($id) {
        Artiste::findOrFail($id)->delete();
        return response()->json(['message' => 'Artiste supprimé']);
    }
}