<?php

namespace App\Http\Controllers\API;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\API\APIController;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;

class AuthController extends APIController
{
    public function signUp(Request $request, CreateNewUser $creator): JsonResponse
    {
        $payload = $request->all();

        // Create the user using Fortify's action
        $user = $creator->create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => $payload['password'],
            'password_confirmation' => $payload['passwordConfirmation'],
        ]);

        return response()->json(new UserResource($user), Response::HTTP_CREATED);
    }
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json(new UserResource($user), 200);
        }

        return response()->json(['error' => 'invalid-credentials'], 401);
    }

    public function checkLoginStatus(): JsonResponse
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json('Not authenticated', 401);
        }

        return response()->json(new UserResource($user), 200);
    }
}
