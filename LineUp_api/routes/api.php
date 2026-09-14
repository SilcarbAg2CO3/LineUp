<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FestivalController;
use App\Http\Controllers\ArtisteController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\ConcertController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\LieuController;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\FestivalierAuthController;
use App\Http\Controllers\BilletController;
use App\Http\Controllers\CasierController;

// ==========================================
// 1. ROUTES PUBLIQUES
// ==========================================
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/admin/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/mobile/login', [FestivalierAuthController::class, 'login']);
Route::post('/mobile/register', [FestivalierAuthController::class, 'register']);
Route::post('/mobile/forgot-password', [FestivalierAuthController::class, 'forgotPassword']);
Route::get('/festivals', [FestivalController::class, 'index']); 

// ==========================================
// 2. ZONE ADMIN (Protégée par Sanctum)
// ==========================================
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    
    // --- PROFIL & AUTH ---
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/user', [AuthController::class, 'me']); 
    Route::put('/profil', [AuthController::class, 'updateProfil']);
    
    // --- FESTIVALS & DASHBOARDS ---
    Route::apiResource('festivals', FestivalController::class);
    Route::get('/festivals/{id}/dashboard', [FestivalController::class, 'dashboard']);
    Route::get('/festivals/{id}/stats', [FestivalController::class, 'stats']);
    Route::post('/festivals/{id}/plan', [FestivalController::class, 'uploadPlan']);

    // --- ROUTES IMBRIQUÉES ---
    Route::get('/festivals/{id}/produits', [ProduitController::class, 'index']);
    Route::post('/festivals/{id}/produits', [ProduitController::class, 'store']);
    Route::get('/festivals/{id}/concerts', [ConcertController::class, 'index']);
    Route::post('/festivals/{id}/concerts', [ConcertController::class, 'store']);
    Route::get('/festivals/{id}/lieux', [LieuController::class, 'index']);
    Route::post('/festivals/{id}/lieux', [LieuController::class, 'store']);
    Route::get('/festivals/{id}/evenements', [OperationController::class, 'index']);
    Route::post('/festivals/{id}/evenements', [OperationController::class, 'store']);
    Route::get('/festivals/{id}/avis', [AvisController::class, 'index']); // <-- AJOUT DE LA ROUTE ICI

    // --- RESSOURCES STANDARDS ---
    Route::apiResource('artistes', ArtisteController::class);
    Route::apiResource('produits', ProduitController::class)->except(['index', 'store']);
    Route::apiResource('concerts', ConcertController::class)->except(['index', 'store']);
    Route::apiResource('lieux', LieuController::class)->except(['index', 'store']);
    Route::apiResource('evenements', OperationController::class)->except(['index', 'store']); 
    
    Route::get('/statistiques', [AvisController::class, 'statsGlobales']);
});

// ==========================================
// 3. ZONE APP MOBILE
// ==========================================
Route::middleware('auth:sanctum')->prefix('mobile')->group(function () {
    Route::post('/logout', [FestivalierAuthController::class, 'logout']);
    Route::post('/billets/associer', [BilletController::class, 'associer']);
    Route::get('/mes-billets', [BilletController::class, 'mesBillets']);
    Route::post('/casiers/reserver', [CasierController::class, 'reserver']);
    Route::post('/avis', [AvisController::class, 'store']); 
    Route::put('/profil', [FestivalierAuthController::class, 'updateProfil']);
});