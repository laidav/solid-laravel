<?php

use App\Http\Controller\API\AuthController;
use Illuminate\Support\Facades\Route;

// AUTH ROUTES

Route::prefix('v1')->group(function() {
    Route::post('/register', [AuthController::class, 'register']);
});

// Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])
//     ->name('password.reset');
