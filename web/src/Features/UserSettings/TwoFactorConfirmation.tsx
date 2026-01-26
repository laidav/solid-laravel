import { useRxApp } from "../Shared/Components/RxAppProvider";
import { createReactable } from "../../reactables/createReactable";
import { build, group, control } from "@reactables/forms";
import { Form } from "../../reactables/SolidForms/Form";
import { Field } from "../../reactables/SolidForms/Field";
import TextInput from "../Shared/Components/Forms/TextInput";

const TwoFactorConfirmation = () => {
  const rxForm = createReactable(() =>
    build(
      group({
        controls: {
          code: control(["", "required"]),
        },
      }),
    ),
  );

  const [
    appState,
    {
      auth: { twoFactorAuthentication: twoFactorActions },
    },
  ] = useRxApp();

  const getQrCode = () => twoFactorActions.getQrCode.send(undefined);
  getQrCode();

  const twoFactorState = () => appState().auth.twoFactorAuthentication;

  return (
    <div>
      {twoFactorState().getQrCode.loading ? (
        <div>Generating QR Code...</div>
      ) : (
        <>
          <h3>
            Please scan the QR code into your authenticator app and confirm your
            two factor authentication
          </h3>
          <div innerHTML={twoFactorState().getQrCode.data?.svg}></div>
          <button type="button" onClick={getQrCode}>
            Regenerate QR Code
          </button>
          <Form rxForm={rxForm}>
            <Field
              component={TextInput}
              name="code"
              label="Enter code for confirmation"
            />
          </Form>
        </>
      )}
    </div>
  );
};

export default TwoFactorConfirmation;
