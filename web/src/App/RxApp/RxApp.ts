import { type ReactableState } from "@reactables/core";
import { combine } from "@reactables/core";
import { RxAuth } from "./RxAuth";
import { AuthService } from "../../Services/AuthService";

const RxApp = ({
  authService,
}: {
  authService: ReturnType<typeof AuthService>;
}) => {
  return combine({
    auth: RxAuth({ authService }),
    /// ... more slices to app state can be added as needed
  });
};

type AppState = ReactableState<typeof RxApp>;

RxApp.selectors = {
  /**
   * AUTH SELECTORS
   */
  userLoaded: ({
    auth: {
      user: { loading, data },
    },
  }: AppState) => !(loading && !data),

  getUser: ({ auth }: AppState) => auth.user.data,

  userVerified: ({ auth }: AppState) =>
    auth.login.isLoggedIn && auth.user.data?.emailVerified,

  loadingUser: ({ auth }: AppState) => auth.user.loading,

  isLockedOut: ({ auth }: AppState) => auth.login.lockedOut,

  isLoggedIn: ({ auth }: AppState) => auth.login.isLoggedIn,

  isLoggingIn: ({ auth }: AppState) => auth.login.loggingIn,

  isLoggingOut: ({ auth }: AppState) => auth.login.loggingOut,

  isCheckingLoginStatus: ({ auth }: AppState) => auth.login.checkingLoginStatus,

  twoFactorRequiresPassword: ({
    auth: { twoFactorAuthentication },
  }: AppState) =>
    Object.values(twoFactorAuthentication).some(
      ({ requiresPasswordConfirmation }) => requiresPasswordConfirmation,
    ),

  isDisablingTwoFactor: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.disable.loading || auth.user.loading,

  isEnablingTwoFactor: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.enable.loading || auth.user.loading,

  loadingTwoFactorQrCodes: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.getQrCode.loading,

  twoFactorQrCode: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.getQrCode.data?.svg,

  tooManyTwoFactorConfirmationAttempts: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.confirm.error?.httpStatus === 429,

  isSubmittingTwoFactorConfirmation: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.confirm.loading,

  getRecoveringCodes: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.recoveryCodes.data?.data,

  isLoadingRecoveringCodes: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.recoveryCodes.loading,

  isRegeneratingRecoveryCodes: ({ auth }: AppState) =>
    auth.twoFactorAuthentication.regenerateRecoveryCodes.loading,
};

export default RxApp;
