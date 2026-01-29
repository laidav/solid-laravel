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
  twoFactorRequiresPassword: ({
    auth: {
      twoFactorAuthentication: {
        enable,
        disable,
        getQrCode,
        confirm,
        recoveryCodes,
        regenerateRecoveryCodes,
      },
    },
  }: AppState) =>
    enable.requiresPasswordConfirmation ||
    disable.requiresPasswordConfirmation ||
    getQrCode.requiresPasswordConfirmation ||
    confirm.requiresPasswordConfirmation ||
    recoveryCodes.requiresPasswordConfirmation ||
    regenerateRecoveryCodes.requiresPasswordConfirmation,
};

export default RxApp;
