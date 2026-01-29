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
  });
};

type AppState = ReactableState<typeof RxApp>;

RxApp.selectors = {
  getUser: (state: AppState) => state.auth.user.data,
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
};

export default RxApp;
