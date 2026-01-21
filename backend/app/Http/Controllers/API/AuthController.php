<?php

namespace App\Http\Controllers\API;

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\API\APIController;
use Illuminate\Support\Facades\Auth;

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

        return response()->json(['userId' => $user->id], Response::HTTP_CREATED);
    }
        public function me(): Response
    {
        $user = Auth::user();
        if (! $user) {
            return response('Not authenticated', 401);
        }

        return response([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'emailVerified' => User::hasVerifiedEmail(),
            ], 200);
    }
}
