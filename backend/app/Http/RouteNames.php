<?php

namespace App\Http;

final class RouteNames
{
    // Base
    public const API_V1 = 'api.v1.';

    // Auth
    public const AUTH_CSRF_COOKIE = self::API_V1.'auth.csrf-cookie';

    public const AUTH_SIGN_UP = self::API_V1.'auth.sign-up';

    public const AUTH_LOGIN = self::API_V1.'auth.login';
    public const AUTH_LOGOUT = self::API_V1.'auth.logout';

    public const AUTH_FORGOT_PASSWORD = self::API_V1.'auth.forgot-password';
    public const AUTH_RESET_PASSWORD = self::API_V1.'auth.reset-password';

    public const AUTH_CHECK_LOGIN_STATUS = self::API_V1.'auth.check-login-status';
    public const AUTH_ENABLE_2FA = self::API_V1.'auth.enable-two-factor-authentication';
    public const AUTH_DISABLE_2FA = self::API_V1.'auth.disable-two-factor-authentication';
    public const AUTH_2FA_QR_CODE = self::API_V1.'auth.two-factor-qr-code';
    public const AUTH_CONFIRM_2FA = self::API_V1.'auth.confim-two-factor';
    public const AUTH_SHOW_2FA_RECOVERY_CODES = self::API_V1.'auth.show-two-factor-recovery-codes';
    public const AUTH_REGENERATE_2FA_RECOVERY_CODES = self::API_V1.'auth.regenerate-two-factor-recovery-codes';

    // Email verification
    public const VERIFICATION_SEND = self::API_V1.'verification.send';

    // Test / internal
    public const LOGGED_IN_TEST = self::API_V1.'loggedin.test';
}
