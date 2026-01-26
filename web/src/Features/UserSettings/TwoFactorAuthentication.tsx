import { Show } from "solid-js";
import { useRxApp } from "../Shared/Components/RxAppProvider";
import TwoFactorConfirmation from "./TwoFactorConfirmation";
const TwoFactorAuthentication = () => {
  const [
    appState,
    {
      auth: { twoFactorAuthentication: twoFactorActions },
    },
  ] = useRxApp();

  const twoFactorAuthState = () => appState().auth.twoFactorAuthentication;
  const user = () => appState().auth.login.currentUser;
  return (
    <div>
      <h3>Two Factor Authentication</h3>
      {user()?.twoFactorEnabled ? (
        <div>
          <button
            type="button"
            disabled={twoFactorAuthState().disable.loading}
            onClick={twoFactorActions.disable.send}
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            disabled={twoFactorAuthState().enable.loading}
            onClick={twoFactorActions.enable.send}
          >
            Enable 2FA
          </button>
        </div>
      )}
      <Show when={user()?.twoFactorEnabled && !user()?.twoFactorConfirmed}>
        <TwoFactorConfirmation />
      </Show>
      {user()?.twoFactorConfirmed && user()?.twoFactorConfirmed && (
        <div>2FA Enabled!</div>
      )}
    </div>
  );
};

export default TwoFactorAuthentication;
