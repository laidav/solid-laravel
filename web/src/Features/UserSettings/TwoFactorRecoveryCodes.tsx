import { combine } from "@reactables/core";
import { of, merge } from "rxjs";
import { map } from "rxjs/operators";
import { createReactable } from "../../reactables/createReactable";
import { useApi } from "../Shared/Components/ApiProvider";
import { AuthService } from "../../Services/AuthService";
import { RxRequest } from "../Shared/Rx/RxRequest";

const TwoFactorRecoveryCodes = () => {
  const [state, actions] = createReactable(() => {
    const authService = AuthService(useApi());

    const rxRegenerateRecoveryCodes = RxRequest({
      resource: authService.regenerateRecoveryCodes,
    });

    const [, , regenCodesActions$] = rxRegenerateRecoveryCodes;

    const codesRengerated$ = regenCodesActions$.ofTypes([
      regenCodesActions$.types.sendSuccess,
    ]);

    const rxRecoveryCodes = RxRequest<undefined, { data: string[] }>({
      resource: authService.getRecoveryCodes,
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
          <button type="button" onClick={actions.regenerateRecoveryCodes.send}>
            Regenerate Recovery Codes
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorRecoveryCodes;
