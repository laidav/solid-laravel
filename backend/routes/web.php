<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect(sprintf("%s%s",  env('APP_FRONTEND_URL'), '/home'));
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::get('/login', function() {})
    ->name('login');