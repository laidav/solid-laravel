import { useRxApp } from "../../Shared/Components/RxAppProvider";
import TwoFactorConfirmation from "./TwoFactorConfirmation";
import TwoFactorRecoveryCodes from "./TwoFactorRecoveryCodes";
const TwoFactorAuthentication = () => {
  const [
    { select },
    {
      auth: { twoFactorAuthentication: twoFactorActions },
    },
  ] = useRxApp();

  return (
    <div>
      <h2>Two Factor Authentication</h2>
      {select.getUser()?.twoFactorEnabled ? (
        <div>
          <button
            type="button"
            disabled={select.isDisablingTwoFactor()}
            onClick={twoFactorActions.disable.send}
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            disabled={select.isEnablingTwoFactor()}
            onClick={twoFactorActions.enable.send}
          >
            Enable 2FA
          </button>
        </div>
      )}
      {select.getUser()?.twoFactorEnabled && (
        <>
          {select.getUser()?.twoFactorConfirmed ? (
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
