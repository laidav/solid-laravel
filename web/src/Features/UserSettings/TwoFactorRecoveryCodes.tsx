import { combine } from "@reactables/core";
import { of, merge } from "rxjs";
import { map } from "rxjs/operators";
import { createReactable } from "../../reactables/createReactable";
import { useApi } from "../Shared/Components/ApiProvider";
import { useRxApp } from "../Shared/Components/RxAppProvider";
import { AuthService } from "../../Services/AuthService";
import { RxRequest, passwordConfirmationHandler } from "../Shared/Rx/RxRequest";

const TwoFactorRecoveryCodes = () => {
  const [state, actions] = createReactable(() => {
    const authService = AuthService(useApi());

    const [, , appActions$] = useRxApp();

    const catchErrorHandler = passwordConfirmationHandler(
      appActions$.ofTypes([
        appActions$.types["[auth] - [passwordConfirmation] - sendSuccess"],
      ]),
      appActions$.ofTypes([
        appActions$.types["[auth] - [passwordConfirmation] - resetState"],
      ]),
    );

    const rxRegenerateRecoveryCodes = RxRequest({
      resource: authService.regenerateRecoveryCodes,
      catchErrorHandler,
    });

    const [, , regenCodesActions$] = rxRegenerateRecoveryCodes;

    const codesRengerated$ = regenCodesActions$.ofTypes([
      regenCodesActions$.types.sendSuccess,
    ]);

    const rxRecoveryCodes = RxRequest<undefined, { data: string[] }>({
      resource: authService.getRecoveryCodes,
      catchErrorHandler,
      sources: [
        merge(of({}), codesRengerated$).pipe(map(() => ({ type: "send" }))),
      ],
    });

    return combine({
      recoveryCodes: rxRecoveryCodes,
      regenerateRecoveryCodes: rxRegenerateRecoveryCodes,
    });
  });

  return (
    <div>
      {state().recoveryCodes.loading ? (
        <div>Loading Recovery Codes</div>
      ) : (
        <div>
          <h3>Recovery Codes</h3>
          <ul>
            {state().recoveryCodes.data?.data.map((code) => (
              <li>{code}</li>
            ))}
          </ul>
          <button
            type="button"
            disabled={state().regenerateRecoveryCodes.loading}
            onClick={actions.regenerateRecoveryCodes.send}
          >
            Regenerate Recovery Codes
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorRecoveryCodes;
