import { combine } from "@reactables/core";
import { take } from "rxjs/operators";
import { useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Field } from "../../reactables/SolidForms/Field";
import EmailInput from "../../Shared/Components/Forms/EmailInput";
import PasswordInput from "../../Shared/Components/Forms/PasswordInput";
import { Form } from "../../reactables/SolidForms/Form";
import { useApi } from "../../Shared/Components/ApiProvider";
import { AuthService } from "../../Services/AuthService";
import { RxRequest } from "../../Shared/Rx/RxRequest";

export interface ResetPasswordFormValue {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const ResetPassword = () => {
  const token = useParams().token;
  const email = useSearchParams()[0].email;
  const [
    resetPasswordState,
    { form: formActions, submitRequest },
    resetPasswordActions$,
  ] = createReactable(() =>
    combine({
      form: build<ResetPasswordFormValue>(
        group({
          controls: {
            token: control([token, "required"]),
            email: control([email, ["required", "email"]]),
            password: control(["", ["required"]]),
            passwordConfirmation: control(["", ["required"]]),
          },
        }),
      ),
      submitRequest: RxRequest({
        resource: AuthService(useApi()).resetPassword,
      }),
    }),
  );

  const navigate = useNavigate();

  resetPasswordActions$
    .ofTypes([resetPasswordActions$.types["[submitRequest] - sendSuccess"]])
    .pipe(take(1))
    .subscribe(() => {
      navigate("/login");
    });

  const formState = () => resetPasswordState().form;

  return (
    <div>
      <Form rxForm={[formState, formActions]}>
        <Field name="email" component={EmailInput} label="Email" readOnly />
        <Field name="password" component={PasswordInput} label="Password" />
        <Field
          name="passwordConfirmation"
          component={PasswordInput}
          label="Confirm Password"
        />
        <button
          disabled={
            resetPasswordState().submitRequest.loading ||
            !formState().root.valid
          }
          onClick={() => submitRequest.send(formState().root.value)}
        >
          Reset Password
        </button>
      </Form>
    </div>
  );
};

export default ResetPassword;
