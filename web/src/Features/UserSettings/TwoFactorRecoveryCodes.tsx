import { Show } from "solid-js";
import { useRxApp } from "../../Shared/Components/RxAppProvider";

const TwoFactorRecoveryCodes = () => {
  const [appState, appActions] = useRxApp();
  const state = () => appState().auth.twoFactorAuthentication;
  const recoveryCodes = () => state().recoveryCodes.data?.data;

  return (
    <div>
      {state().recoveryCodes.loading ? (
        <div>Loading Recovery Codes</div>
      ) : (
        <div>
          <h3>Recovery Codes</h3>
          <Show
            when={recoveryCodes()}
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
            disabled={state().regenerateRecoveryCodes.loading}
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
