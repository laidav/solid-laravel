<?php

namespace App\Http;

final class RouteNames
{
    // Base
    public const API_V1 = 'api.v1.';

    // Auth
    public const AUTH_CSRF_COOKIE = self::API_V1 . 'auth.csrf-cookie';
    public const AUTH_SIGN_UP     = self::API_V1 . 'auth.sign-up';

    // Email verification
    public const VERIFICATION_SEND = self::API_V1 . 'verification.send';

    // Test / internal
    public const LOGGED_IN_TEST = self::API_V1 . 'loggedin.test';
}
