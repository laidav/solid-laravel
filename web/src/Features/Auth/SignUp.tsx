import { combine, type Action } from "@reactables/core";
import { take } from "rxjs/operators";
import { useNavigate } from "@solidjs/router";
import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Field } from "../../reactables/SolidForms/Field";
import TextInput from "../Shared/Components/Forms/TextInput";
import EmailInput from "../Shared/Components/Forms/EmailInput";
import PasswordInput from "../Shared/Components/Forms/PasswordInput";
import { Form } from "../../reactables/SolidForms/Form";
import { useRxApp } from "../Shared/Components/RxAppProvider";
import { useApi } from "../Shared/Components/ApiProvider";
import { AuthService } from "../../Services/authService";
import { RxRequest } from "../Shared/Rx/RxRequest";
import type { User } from "../Shared/Rx/RxAuth";

export interface SignUpFormValue {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp = () => {
  const [signUpState, { form: formActions, submitRequest }, signUpActions$] =
    createReactable(() =>
      combine({
        form: build<SignUpFormValue>(
          group({
            controls: {
              name: control(["", "required"]),
              email: control(["", ["required", "email"]]),
              password: control(["", ["required"]]),
              passwordConfirmation: control(["", ["required"]]),
            },
          }),
        ),
        submitRequest: RxRequest({ resource: AuthService(useApi()).signUp }),
      }),
    );

  const [, appActions] = useRxApp();

  const navigate = useNavigate();

  signUpActions$
    .ofTypes([signUpActions$.types["[submitRequest] - sendSuccess"]])
    .pipe(take(1))
    .subscribe((action: Action) => {
      appActions.auth.loginSuccess(action.payload! as User);
      navigate("/verify-email");
    });

  const formState = () => signUpState().form;

  return (
    <div>
      <Form rxForm={[formState, formActions]}>
        <Field name="name" component={TextInput} label="Username" />
        <Field name="email" component={EmailInput} label="Email" />
        <Field name="password" component={PasswordInput} label="Password" />
        <Field
          name="passwordConfirmation"
          component={PasswordInput}
          label="Confirm Password"
        />
        <button
          type="button"
          disabled={
            signUpState().submitRequest.loading || !formState().root.valid
          }
          onClick={() => submitRequest.send(formState().root.value)}
        >
          Sign Up
        </button>
      </Form>
    </div>
  );
};

export default SignUp;
