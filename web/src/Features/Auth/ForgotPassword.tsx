import { combine } from "@reactables/core";
import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Field } from "../../reactables/SolidForms/Field";
import EmailInput from "../Shared/Components/Forms/EmailInput";
import { Form } from "../../reactables/SolidForms/Form";
import { useApi } from "../Shared/Components/ApiProvider";
import { AuthService } from "../../Services/authService";
import { RxRequest } from "../Shared/Rx/RxRequest";

const ForgotPassword = () => {
  const [state, { form: formActions, submitRequest }] = createReactable(() =>
    combine({
      form: build<{ email: string }>(
        group({
          controls: {
            email: control(["", ["required", "email"]]),
          },
        }),
      ),
      submitRequest: RxRequest({
        debug: true,
        resource: AuthService(useApi()).forgotPassword,
      }),
    }),
  );

  const formState = () => state().form;

  return (
    <>
      {state().submitRequest.error?.httpStatus === 429 ? (
        <h1>Sorry too many attempts. Please try again later.</h1>
      ) : (
        <div>
          <h1>
            Enter the email address associated with your account, and we’ll send
            you a link to reset your password.
          </h1>
          <Form rxForm={[formState, formActions]}>
            <Field name="email" component={EmailInput} label="Email" />
            <button
              type="button"
              disabled={
                state().submitRequest.loading || !formState().root.valid
              }
              onClick={() => submitRequest.send(formState().root.value)}
            >
              Send
            </button>
          </Form>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
