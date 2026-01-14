<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controller\API\AuthController;

Route::get('/', function () {
    return [];
});

Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])
    ->name('password.reset');
