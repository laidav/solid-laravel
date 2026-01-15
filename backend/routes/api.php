<?php

use App\Http\Controller\API\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return [];
});

Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])
    ->name('password.reset');
