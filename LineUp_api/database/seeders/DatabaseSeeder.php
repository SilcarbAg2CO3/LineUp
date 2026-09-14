<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Admin;
use App\Models\Festivalier;
use App\Models\Festival;
use App\Models\Artiste;
use App\Models\Produit;
use App\Models\Billet;
use App\Models\Operation; // <-- Ajout de l'import

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. ADMINS
        $admins = [
            ['prenom' => 'Matthieu', 'nom' => 'Admin', 'email' => 'admin@festival.com', 'role' => 'SuperAdmin'],
            ['prenom' => 'Jean', 'nom' => 'Regisseur', 'email' => 'regie@festival.com', 'role' => 'Admin'],
        ];
        foreach ($admins as $a) {
            Admin::create(array_merge($a, ['password' => Hash::make('password')]));
        }

        // 2. FESTIVALS
        $festivals = [
            ['id' => 'summerside-2026', 'nom' => 'Summerside', 'annee' => 2026],
            ['id' => 'winterbreak-2026', 'nom' => 'Winterbreak', 'annee' => 2026],
        ];
        foreach ($festivals as $f) {
            Festival::create($f);
        }

        // 3. ARTISTES
        $artistes = [
            ['festival_id' => 'summerside-2026', 'nom' => 'Arctic Monkeys', 'statut' => 'Confirmé', 'jour' => 'Vendredi', 'heure' => '21:00', 'scene' => 'Main Stage'],
            ['festival_id' => 'summerside-2026', 'nom' => 'Dua Lipa', 'statut' => 'Confirmé', 'jour' => 'Samedi', 'heure' => '22:30', 'scene' => 'Main Stage'],
        ];
        foreach ($artistes as $art) {
            Artiste::create($art);
        }

        // 4. FESTIVALIERS
        $festivaliers = [
            ['prenom' => 'Matthieu', 'nom' => 'Festivalier', 'email' => 'user@test.com', 'solde_cashless' => 100.00],
            ['prenom' => 'Alice', 'nom' => 'Martin', 'email' => 'alice@test.com', 'solde_cashless' => 25.50],
        ];
        foreach ($festivaliers as $fest) {
            Festivalier::create(array_merge($fest, ['password' => Hash::make('123456')]));
        }

        // 5. TABLE PIVOT admin_festival
        DB::table('admin_festival')->insert([
            'admin_id' => 1,
            'festival_id' => 'summerside-2026'
        ]);

        // 6. PRODUITS
        Produit::create([
            'festival_id' => 'summerside-2026',
            'nom'         => 'T-Shirt Officiel 2026',
            'prix'        => 25,
            'categorie'   => 'Merchandising',
            'stock'       => 450
        ]);

        // 7. BILLETS
        $billets = [
            [
                'festival_id' => 'summerside-2026', 
                'festivalier_id' => 1, 
                'code_barre' => 'DEJA-LIE-789', 
                'type' => 'PASS 3 JOURS - VIP', 
                'prix' => 150.00
            ],
            [
                'festival_id' => 'summerside-2026', 
                'festivalier_id' => null, 
                'code_barre' => 'CODE-SECRET-123', 
                'type' => 'PASS COMPLET', 
                'prix' => 120.00
            ],
        ];
        foreach ($billets as $b) {
            Billet::create($b);
        }

        // 8. OPÉRATIONS (Pour ton calendrier)
        $operations = [
            ['festival_id' => 'summerside-2026', 'titre' => 'Briefing Sécurité Général', 'jour' => 'Vendredi', 'heure' => '08:30', 'lieu' => 'QG Staff', 'type' => 'Sécurité', 'importance' => 'Haute'],
            ['festival_id' => 'summerside-2026', 'titre' => 'Arrivée des fûts', 'jour' => 'Vendredi', 'heure' => '10:00', 'lieu' => 'Zone Logistique', 'type' => 'Logistique', 'importance' => 'Normale'],
        ];
        foreach ($operations as $op) {
            Operation::create($op);
        }
    }
}