import { useRxApp } from "../../Shared/Components/RxAppProvider";
import { Show } from "solid-js";
import { createReactable } from "../../reactables/createReactable";
import { build, group, control } from "@reactables/forms";
import { Form } from "../../reactables/SolidForms/Form";
import { Field } from "../../reactables/SolidForms/Field";
import TextInput from "../../Shared/Components/Forms/TextInput";

const TwoFactorConfirmation = () => {
  const rxForm = createReactable(() =>
    build<{ code: string }>(
      group({
        controls: {
          code: control(["", "required"]),
        },
      }),
    ),
  );

  const [
    { select },
    {
      auth: { twoFactorAuthentication: twoFactorActions },
    },
  ] = useRxApp();

  const getQrCode = () => twoFactorActions.getQrCode.send(undefined);
  getQrCode();

  const [formState] = rxForm;

  return (
    <div>
      {select.loadingTwoFactorQrCodes() ? (
        <div>Generating QR Code...</div>
      ) : (
        <Show
          when={select.twoFactorQrCode()}
          fallback={
            <div>
              You have to verify your password to finish with the 2FA setup.
              Please refresh the page and try again.
            </div>
          }
        >
          <h3>
            Please scan the QR code into your authenticator app and confirm your
            two factor authentication
          </h3>
          <div innerHTML={select.twoFactorQrCode()}></div>
          <button type="button" onClick={getQrCode}>
            Regenerate QR Code
          </button>
          {select.tooManyTwoFactorConfirmationAttempts() ? (
            <h3>Too many attempts. Try again later</h3>
          ) : (
            <Form rxForm={rxForm}>
              <Field
                component={TextInput}
                name="code"
                label="Enter code for confirmation"
              />
              <button
                disabled={
                  !formState().root.valid ||
                  select.isSubmittingTwoFactorConfirmation()
                }
                onClick={() =>
                  twoFactorActions.confirm.send({
                    code: formState().root.value.code,
                  })
                }
              >
                Submit
              </button>
            </Form>
          )}
        </Show>
      )}
    </div>
  );
};

export default TwoFactorConfirmation;
