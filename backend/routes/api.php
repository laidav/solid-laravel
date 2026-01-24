<?php

use App\Http\Controllers\API\AuthController;
use App\Http\RouteNames;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::prefix('v1')->group(function () {

    // AUTH ROUTES
    Route::prefix('auth')->group(function () {

        Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])
            ->name(RouteNames::AUTH_CSRF_COOKIE);

        Route::post('/sign-up', [AuthController::class, 'signUp'])
            ->name(RouteNames::AUTH_SIGN_UP);

        Route::post('/login', [AuthController::class, 'login'])
            ->name(RouteNames::AUTH_LOGIN);

        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            ->name(RouteNames::AUTH_FORGOT_PASSWORD);

        Route::get('/check-login-status', [AuthController::class, 'checkLoginStatus'])
            ->name(RouteNames::AUTH_CHECK_LOGIN_STATUS);

        Route::post('/verification-notification', function (Request $request) {
            $request->user()->sendEmailVerificationNotification();

            return response()->json([
                'message' => 'Verification link sent!',
            ]);
        })
            ->middleware(['auth:sanctum', 'throttle:6,1'])
            ->name(RouteNames::VERIFICATION_SEND);
    });

    // AUTHENTICATED ROUTES
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::post('/loggedin-test', function () {
            return response()->json(['ok' => true]);
        })->name(RouteNames::LOGGED_IN_TEST);
    });
});
