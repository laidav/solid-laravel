import { RxRequest } from "../Shared/Rx/RxRequest";
import { AuthService } from "../../Services/authService";
import { useApi } from "../Shared/Components/ApiProvider";
import { createReactable } from "../../reactables/createReactable";
import { Show } from "solid-js";

const VerifyEmailNotice = () => {
  const [state, actions] = createReactable(() => {
    return RxRequest({
      resource: AuthService(useApi()).resendEmailVerification,
    });
  });
  return (
    <Show when={state()}>
      {(s) => (
        <>
          <div class="email-verification">
            <h2>Verify your email address</h2>

            <p>
              We’ve sent a verification link to your email address. Please check
              your inbox (and spam folder) and click the link to continue.
            </p>

            <p>
              Didn’t receive the email?
              <button
                type="button"
                disabled={s().loading}
                onClick={actions.send}
              >
                Resend verification email
              </button>
              {s().error?.httpStatus === 429 && <div>{s().error?.message}</div>}
            </p>
          </div>
        </>
      )}
    </Show>
  );
};

export default VerifyEmailNotice;
