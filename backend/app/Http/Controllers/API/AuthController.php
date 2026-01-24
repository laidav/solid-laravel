<?php

namespace App\Http\Controllers\API;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\API\APIController;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\RateLimiter;

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

        $throttleKey = $this->throttleKey($request);

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response()->json(['message' => 'too many attempts'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        if (Auth::attempt($credentials)) {
            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json(new UserResource($user), Response::HTTP_OK);
        }

        RateLimiter::hit($throttleKey);
        return response()->json(['message' => 'invalid-credentials'], Response::HTTP_UNAUTHORIZED);
    }

    public function checkLoginStatus(): JsonResponse
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json('Not authenticated', 401);
        }

        return response()->json(new UserResource($user), 200);
    }
    protected function throttleKey(Request $request): string
    {
        return strtolower($request->input('email')).'|'.$request->ip();
    }
}
