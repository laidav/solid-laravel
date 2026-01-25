<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect(sprintf("%s%s",  env('APP_FRONTEND_URL'), '/'));
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::get('/login', function() {})
    ->name('login');

Route::get('/reset-password/{token}', function (string $token, Request $request) {
    $spaUrl = env('APP_FRONTEND_URL', '/');

    $query = http_build_query($request->query());

    return redirect()->to("{$spaUrl}/reset-password/{$token}?{$query}");
})
->middleware('guest')
->name('password.reset');