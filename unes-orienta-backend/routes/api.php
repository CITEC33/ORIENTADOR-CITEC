<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminStatsController;
use App\Http\Controllers\AdminUsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\KnowledgeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — UNES Orienta IA
|--------------------------------------------------------------------------
*/

// --- Auth de usuarios (sin contraseña) ---
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

// --- Chat con Aquila (requiere usuario autenticado) ---
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('chat', [ChatController::class, 'chat']);
});

// --- Panel admin ---
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminController::class, 'login'])->middleware('throttle:5,1');
    Route::post('logout', [AdminController::class, 'logout']);

    Route::middleware('admin.session')->group(function () {
        Route::get('bot-config', [AdminController::class, 'getConfig']);
        Route::put('bot-config', [AdminController::class, 'updateConfig']);
        Route::post('bot-config/test', [AdminController::class, 'testConnection']);

        // --- Base de conocimiento (RAG) ---
        Route::get('knowledge', [KnowledgeController::class, 'index']);
        Route::post('knowledge', [KnowledgeController::class, 'store']);
        Route::get('knowledge/{id}', [KnowledgeController::class, 'show'])->whereNumber('id');
        Route::put('knowledge/{id}', [KnowledgeController::class, 'update'])->whereNumber('id');
        Route::delete('knowledge/{id}', [KnowledgeController::class, 'destroy'])->whereNumber('id');
        Route::post('knowledge/{id}/reindex', [KnowledgeController::class, 'reindexOne'])->whereNumber('id');
        Route::post('knowledge/reindex-all', [KnowledgeController::class, 'reindexAll']);
        Route::post('knowledge/preview', [KnowledgeController::class, 'preview']);

        // --- Gestión de usuarios registrados ---
        Route::get('users', [AdminUsersController::class, 'index']);
        Route::get('users/export.csv', [AdminUsersController::class, 'exportCsv']);
        Route::get('users/{id}', [AdminUsersController::class, 'show'])->whereNumber('id');
        Route::delete('users/{id}', [AdminUsersController::class, 'destroy'])->whereNumber('id');

        // --- Dashboard analítico ---
        Route::get('stats', [AdminStatsController::class, 'stats']);
    });
});

// Health check
Route::get('health', fn () => response()->json(['ok' => true, 'app' => 'UNES Orienta IA']));
