<?php

namespace App\Http\Controllers\API;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\API\APIController;

class AuthController extends APIController
{
    public function signUp(Request $request, CreateNewUser $creator): JsonResponse
    {
        // Create the user using Fortify's action
        $user = $creator->create($request->only([
            'name',
            'email',
            'password',
            'password_confirmation',
        ]));

        return response()->json(['userId' => $user->id], Response::HTTP_CREATED);
    }
}
