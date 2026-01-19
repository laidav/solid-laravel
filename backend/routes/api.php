<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;

// AUTH ROUTES

Route::prefix('v1')->group(function() {
    Route::post('/sign-up', [AuthController::class, 'signUp']);
});
