<?php
namespace App\Http\Controllers;

use App\Models\Concert;
use Illuminate\Http\Request;

class ConcertController extends Controller {
    
    // GET /api/admin/festivals/{id}/concerts
    // GET /api/admin/festivals/{id}/concerts
    public function index($festival_id)
    {
        // On récupère tous les concerts liés à ce festival précis
        $concerts = Concert::where('festival_id', $festival_id)->get();
        return response()->json($concerts);
    }

    // POST /api/admin/festivals/{id}/concerts
    public function store(Request $request, $festivalId) {
        $request->validate([
            // Adapte 'artiste' par 'artiste_id' si tu gères les relations strictes en BDD
            'nom' => 'required', 
            'jour' => 'required',
            'heure' => 'required',
            'scene' => 'required'
        ]);

        $data = $request->all();
        $data['festival_id'] = $festivalId;

        return response()->json(Concert::create($data), 201);
    }

    // GET /api/admin/concerts/{id}
    public function show($id) {
        return response()->json(Concert::with(['festival', 'artiste'])->findOrFail($id));
    }

    // PUT /api/admin/concerts/{id}
    public function update(Request $request, $id) {
        $concert = Concert::findOrFail($id);
        $concert->update($request->all());
        return response()->json($concert);
    }

    // DELETE /api/admin/concerts/{id}
    public function destroy($id) {
        Concert::findOrFail($id)->delete();
        return response()->json(['message' => 'Concert annulé']);
    }
}