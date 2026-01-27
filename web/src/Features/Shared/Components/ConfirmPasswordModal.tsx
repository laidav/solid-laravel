import { build, group, control } from "@reactables/forms";
import { createEffect } from "solid-js";
import { Form } from "../../../reactables/SolidForms/Form";
import { Field } from "../../../reactables/SolidForms/Field";
import PasswordInput from "./Forms/PasswordInput";
import { useRxApp } from "./RxAppProvider";

import { createReactable } from "../../../reactables/createReactable";

const ConfirmPasswordModal = () => {
  let dialog!: HTMLDialogElement;

  createEffect(() => {
    dialog.showModal();
  });

  const rxForm = createReactable(() =>
    build<{ password: string }>(
      group({
        controls: {
          password: control(["", "required"]),
        },
      }),
    ),
  );

  const [appState, appActions] = useRxApp();
  const [formState] = rxForm;

  return (
    <dialog ref={dialog}>
      <h3>Please confirm your password to continue.</h3>
      <Form rxForm={rxForm}>
        <Field name="password" component={PasswordInput} label="Password" />
        <button
          type="button"
          onClick={appActions.auth.passwordConfirmation.resetState}
        >
          Cancel
        </button>
        <button
          disabled={
            appState().auth.passwordConfirmation.loading ||
            !formState().root.valid
          }
          onClick={() =>
            appActions.auth.passwordConfirmation.send(formState().root.value)
          }
        >
          Submit
        </button>
      </Form>
    </dialog>
  );
};

export default ConfirmPasswordModal;
