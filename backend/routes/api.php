<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

// AUTH ROUTES

Route::prefix('v1')->group(function() {
    Route::post('/sign-up', [AuthController::class, 'signUp']);
});

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');

// Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])
//     ->name('password.reset');