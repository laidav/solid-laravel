import { Show } from "solid-js";
import { useRxApp } from "../Shared/Components/RxAppProvider";
import TwoFactorConfirmation from "./TwoFactorConfirmation";
import TwoFactorRecoveryCodes from "./TwoFactorRecoveryCodes";
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
      {user()?.twoFactorEnabled && (
        <>
          {user()?.twoFactorConfirmed ? (
            <div>
              <h3>Two factor authentication enabled.</h3>
              <br />
              <TwoFactorRecoveryCodes />
            </div>
          ) : (
            <TwoFactorConfirmation />
          )}
        </>
      )}
    </div>
  );
};

export default TwoFactorAuthentication;
