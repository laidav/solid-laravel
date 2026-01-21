<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// AUTH ROUTES

Route::prefix('v1')->group(function() {
    Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
    Route::post('/sign-up', [AuthController::class, 'signUp']);
});
