<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lieu;

class LieuController extends Controller {
    
    // GET /api/admin/festivals/{id}/lieux
    public function index($festivalId) {
        return response()->json(Lieu::where('festival_id', $festivalId)->get());
    }

    // POST /api/admin/festivals/{id}/lieux
    public function store(Request $request, $festivalId) {
        $request->validate([
            'nom' => 'required', 
            'type' => 'required'
        ]);

        $data = $request->all();
        $data['festival_id'] = $festivalId; // On lie le lieu au festival via l'URL

        return response()->json(Lieu::create($data), 201);
    }

    // PUT /api/admin/lieux/{id}
    public function update(Request $request, $id) {
        $lieu = Lieu::findOrFail($id);
        $lieu->update($request->all());
        return response()->json($lieu);
    }

    // DELETE /api/admin/lieux/{id}
    public function destroy($id) {
        Lieu::findOrFail($id)->delete();
        return response()->json(['message' => 'Lieu supprimé']);
    }
}