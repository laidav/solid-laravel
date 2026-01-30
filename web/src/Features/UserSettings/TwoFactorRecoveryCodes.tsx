import { Show } from "solid-js";
import { useRxApp } from "../../Shared/Components/RxAppProvider";

const TwoFactorRecoveryCodes = () => {
  const [{ select }, appActions] = useRxApp();

  return (
    <div>
      {select.isLoadingRecoveringCodes() ? (
        <div>Loading Recovery Codes</div>
      ) : (
        <div>
          <h3>Recovery Codes</h3>
          <Show
            when={select.getRecoveringCodes()}
            fallback={
              <button
                onClick={
                  appActions.auth.twoFactorAuthentication.recoveryCodes.send
                }
              >
                Get Recovery Codes
              </button>
            }
          >
            {(codes) => (
              <>
                <ul>
                  {codes()?.map((code) => (
                    <li>{code}</li>
                  ))}
                </ul>
              </>
            )}
          </Show>
          <button
            type="button"
            disabled={select.isRegeneratingRecoveryCodes()}
            onClick={
              appActions.auth.twoFactorAuthentication.regenerateRecoveryCodes
                .send
            }
          >
            Regenerate Recovery Codes
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorRecoveryCodes;
