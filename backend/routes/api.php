<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
        use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// AUTH ROUTES

Route::prefix('v1')->group(function() {
    Route::prefix('auth')->group(function() {
        Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
        Route::post('/sign-up', [AuthController::class, 'signUp']);
    });

    // Authenticated Routes
    Route::middleware(['auth:sanctum'])->group(function() {

        Route::post('/email/verification-notification', function (Request $request) {
            $request->user()->sendEmailVerificationNotification();

            return back()->with('message', 'Verification link sent!');
        })->middleware(['throttle:6,1'])->name('verification.send');

        // Email verified Routes
        Route::middleware(['verified'])->group(function() {
            Route::post('/loggedin-test', [function() {}]);
        });
    });
});
