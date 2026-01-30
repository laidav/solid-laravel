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
  userLoaded: (state: AppState) => {
    const {
      user: { loading, data },
    } = state.auth;
    return !(loading && !data);
  },
  getUser: (state: AppState) => state.auth.user.data,
  userVerified: (state: AppState) =>
    state.auth.login.isLoggedIn && state.auth.user.data?.emailVerified,
  loadingUser: (state: AppState) => state.auth.user.loading,
  isLockedOut: (state: AppState) => state.auth.login.lockedOut,
  isLoggedIn: (state: AppState) => state.auth.login.isLoggedIn,
  isLoggingIn: (state: AppState) => state.auth.login.loggingIn,
  isCheckingLoginStatus: (state: AppState) =>
    state.auth.login.checkingLoginStatus,
  twoFactorRequiresPassword: ({
    auth: { twoFactorAuthentication },
  }: AppState) =>
    Object.values(twoFactorAuthentication).some(
      ({ requiresPasswordConfirmation }) => requiresPasswordConfirmation,
    ),
  isDisablingTwoFactor: (state: AppState) =>
    state.auth.twoFactorAuthentication.disable.loading,
  isEnablingTwoFactor: (state: AppState) =>
    state.auth.twoFactorAuthentication.enable.loading,
  loadingTwoFactorQrCodes: (state: AppState) =>
    state.auth.twoFactorAuthentication.getQrCode.loading,
  twoFactorQrCode: (state: AppState) =>
    state.auth.twoFactorAuthentication.getQrCode.data?.svg,
  tooManyTwoFactorConfirmationAttempts: (state: AppState) =>
    state.auth.twoFactorAuthentication.confirm.error?.httpStatus === 429,
  isSubmittingTwoFactorConfirmation: (state: AppState) =>
    state.auth.twoFactorAuthentication.confirm.loading,
  getRecoveringCodes: (state: AppState) =>
    state.auth.twoFactorAuthentication.recoveryCodes.data?.data,
  isLoadingRecoveringCodes: (state: AppState) =>
    state.auth.twoFactorAuthentication.recoveryCodes.loading,
  isRegeneratingRecoveryCodes: (state: AppState) =>
    state.auth.twoFactorAuthentication.regenerateRecoveryCodes.loading,
};

export default RxApp;
