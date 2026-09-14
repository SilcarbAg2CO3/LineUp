<?php
namespace App\Http\Controllers;

use App\Models\Festival;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FestivalController extends Controller {
    
    // Lecture avec Jointures et Recherche
    public function index(Request $request) {
    // On ne cherche plus 'concerts.artiste', juste 'concerts'
    $query = Festival::with('concerts'); 
    
    if ($request->has('recherche')) {
        $query->where('nom', 'like', '%' . $request->recherche . '%');
    }
    return response()->json($query->get());
}

    // Ajout avec Validation
    public function store(Request $request) {
        $request->validate([
            'nom' => 'required',
            'annee' => 'required|integer'
        ]);

        $data = $request->all();
        
        // Génération automatique du slug/id si React ne l'envoie pas
        if (!isset($data['id']) && !isset($data['slug'])) {
            $data['id'] = Str::slug($data['nom']) . '-' . $data['annee'];
        }

        $festival = Festival::create($data);
        return response()->json($festival, 201);
    }

    // Lecture d'un seul festival (pour le LayoutAdmin)
    public function show($id) {
        $festival = Festival::findOrFail($id);
        
        // On s'assure de renvoyer l'URL absolue pour le front-end
        if ($festival->plan_image && !str_starts_with($festival->plan_image, 'http')) {
            $festival->plan_image = asset('storage/' . $festival->plan_image);
        }
        
        return response()->json($festival);    }

    // Modification
    public function update(Request $request, $id) {
        $festival = Festival::findOrFail($id);
        $festival->update($request->all());
        return response()->json($festival);
    }

    // Suppression avec Gestion de Rôle
    public function destroy(Request $request, $id) {
        // Vérification du privilège
        if ($request->user() && $request->user()->role !== 'SuperAdmin') {
            return response()->json(['message' => 'Privilèges insuffisants'], 403);
        }

        $festival = Festival::findOrFail($id);
        $festival->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    // ==========================================
    // MÉTHODES POUR LES DASHBOARDS REACT
    // ==========================================

   public function dashboard($id) {
        // 1. Statistiques globales (KPIs)
        $nbBillets = \App\Models\Billet::where('festival_id', $id)->count();
        $revenusCashless = \App\Models\Commande::where('festival_id', $id)->sum('montant_total');
        $nbCasiers = \App\Models\Casier::where('festival_id', $id)->count();
        // On suppose que les alertes sont des opérations de type "Sécurité" ou "Alerte"
        $nbAlertes = \App\Models\Operation::where('festival_id', $id)->where('type', 'Securite')->count();

        // 2. Données du graphique (Agrégation par mois)
        $billetsParMois = \App\Models\Billet::where('festival_id', $id)
            ->selectRaw('MONTH(created_at) as mois, COUNT(*) as total')
            ->groupBy('mois')
            ->pluck('total', 'mois')
            ->toArray();

        $cashlessParMois = \App\Models\Commande::where('festival_id', $id)
            ->selectRaw('MONTH(created_at) as mois, SUM(montant_total) as total')
            ->groupBy('mois')
            ->pluck('total', 'mois')
            ->toArray();

        $nomsMois = [1=>'Jan', 2=>'Fév', 3=>'Mar', 4=>'Avr', 5=>'Mai', 6=>'Juin', 7=>'Juil', 8=>'Aoû', 9=>'Sep', 10=>'Oct', 11=>'Nov', 12=>'Déc'];
        
        $graphique = [];
        for ($i = 1; $i <= 12; $i++) {
            // On n'ajoute au graphique que les mois qui contiennent des ventes
            if (isset($billetsParMois[$i]) || isset($cashlessParMois[$i])) {
                $graphique[] = [
                    'mois' => $nomsMois[$i],
                    'billets' => $billetsParMois[$i] ?? 0,
                    'cashless' => (int) ($cashlessParMois[$i] ?? 0)
                ];
            }
        }

        return response()->json([
            'stats' => [
                'billets' => number_format($nbBillets, 0, ',', ' '),
                'cashless' => number_format($revenusCashless, 0, ',', ' ') . ' €',
                'casiers' => (string) $nbCasiers,
                'alertes' => (string) $nbAlertes
            ],
            // array_values permet de réindexer le tableau proprement pour React
            'graphique' => array_values($graphique) 
        ]);
    }

   public function stats($festival_id)
    {
        // 1. AVIS & PERFORMANCES
        // On récupère les concerts du festival avec leurs avis et les festivaliers associés
        $concerts = \App\Models\Artiste::where('festival_id', $festival_id)
                        ->with('avis.festivalier')
                        ->get();

        $totalAvis = 0;
        $sommeNotes = 0;
        $performances = [];

        foreach ($concerts as $concert) {
            $nbAvis = $concert->avis->count();
            $totalAvis += $nbAvis;

            $noteMoyenne = $nbAvis > 0 ? round($concert->avis->avg('note'), 1) : '-';
            if ($nbAvis > 0) $sommeNotes += $concert->avis->sum('note');

            // Formatage des commentaires pour React
            $commentaires = $concert->avis->map(function($a) {
                return [
                    'user'  => $a->festivalier ? $a->festivalier->prenom . ' ' . substr($a->festivalier->nom, 0, 1) . '.' : 'Anonyme',
                    'date'  => 'Récent', // Pas de champ date dans ta table SQL actuelle
                    'note'  => $a->note,
                    'texte' => $a->commentaire
                ];
            });

            $performances[] = [
                'id'           => $concert->id,
                'artiste'      => $concert->nom, // La colonne s'appelle "nom" suite à nos modifs
                'noteMoyenne'  => (string) $noteMoyenne,
                'nbAvis'       => $nbAvis,
                'tendance'     => $nbAvis > 0 ? 'Stable' : 'À venir',
                'commentaires' => $commentaires
            ];
        }

        $noteGlobale = $totalAvis > 0 ? round($sommeNotes / $totalAvis, 1) : '-';

        // 2. VENTES (Calculé depuis la table Billets)
        $billets = \App\Models\Billet::where('festival_id', $festival_id)
            ->selectRaw('type, count(*) as quantite, sum(prix) as revenu')
            ->groupBy('type')
            ->get();

        $ventes = $billets->map(function($b, $index) {
            return [
                'id'       => $index + 1,
                'type'     => $b->type,
                'quantite' => (string) $b->quantite,
                'revenu'   => number_format($b->revenu, 0, ',', ' ') . ' €'
            ];
        });

        // 3. RÉPONSE JSON
        return response()->json([
            'statut'       => 'Actif',
            'totalAvis'    => (string) $totalAvis,
            'noteGlobale'  => (string) $noteGlobale,
            'performances' => $performances,
            'ventes'       => $ventes
        ]);
    }

    public function uploadPlan(Request $request, $id) {
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240'
    ]);

    $festival = Festival::findOrFail($id);

    if ($request->hasFile('image')) {
        // Stockage dans storage/app/public/plans
        $path = $request->file('image')->store('plans', 'public');
        $festival->plan_image = $path;
        $festival->save();

        return response()->json(['url' => asset('storage/' . $path)]);
    }

    return response()->json(['error' => 'Aucune image trouvée'], 400);
}
}