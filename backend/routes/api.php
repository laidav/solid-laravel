<?php

use App\Http\Controllers\API\AuthController;
use App\Http\RouteNames;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Http\Controllers\RecoveryCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController;
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

        Route::post('/logout', [AuthController::class, 'logout'])
            ->name(RouteNames::AUTH_LOGOUT);

        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            ->name(RouteNames::AUTH_FORGOT_PASSWORD);

        Route::post('/reset-password', [AuthController::class, 'resetPassword'])
            ->name(RouteNames::AUTH_RESET_PASSWORD);

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

        Route::middleware(['auth:sanctum', 'verified'])->group(function () {
            Route::post('/two-factor-authentication', [TwoFactorAuthenticationController::class, 'store'])
                ->name(RouteNames::AUTH_ENABLE_2FA);

            Route::delete('/two-factor-authentication', [TwoFactorAuthenticationController::class, 'destroy'])
                ->name(RouteNames::AUTH_DISABLE_2FA);

            Route::get('/two-factor-qr-code', [TwoFactorQrCodeController::class, 'show'])
                ->name(RouteNames::AUTH_2FA_QR_CODE);

            Route::post('/confirm-two-factor', [ConfirmTwoFactorAuthentication::class, 'store'])
                ->name(RouteNames::AUTH_CONFIRM_2FA);

            Route::get('/recovery-codes', [RecoveryCodeController::class, 'index'])
                ->name(RouteNames::AUTH_2FA_QR_CODE);

            Route::post('/recovery-codes', [RecoveryCodeController::class, 'store'])
                ->name(RouteNames::AUTH_REGENERATE_2FA_RECOVERY_CODES);

        });
    });

    // AUTHENTICATED ROUTES
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::post('/loggedin-test', function () {
            return response()->json(['ok' => true]);
        })->name(RouteNames::LOGGED_IN_TEST);
    });
});
