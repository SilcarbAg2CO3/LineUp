<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Operation;

class OperationController extends Controller {
    
    // GET /api/admin/festivals/{id}/evenements
    public function index($festivalId) {
        return response()->json(Operation::where('festival_id', $festivalId)->get());
    }

    // POST /api/admin/festivals/{id}/evenements
    public function store(Request $request, $festivalId) {
        $request->validate([
            'titre' => 'required'
        ]);

        $data = $request->all();
        $data['festival_id'] = $festivalId; // On lie l'opération au festival de l'URL

        return response()->json(Operation::create($data), 201);
    }

    // PUT /api/admin/evenements/{id}
    public function update(Request $request, $id) {
        $operation = Operation::findOrFail($id);
        $operation->update($request->all());
        return response()->json($operation);
    }

    // DELETE /api/admin/evenements/{id}
    public function destroy($id) {
        Operation::findOrFail($id)->delete();
        return response()->json(['message' => 'Opération supprimée']);
    }
}