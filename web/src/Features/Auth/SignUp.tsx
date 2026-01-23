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

export interface SignUpFormValue {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp = () => {
  const rxForm = createReactable(() =>
    build<SignUpFormValue>(
      group({
        controls: {
          name: control(["", "required"]),
          email: control(["", ["required", "email"]]),
          password: control(["", ["required"]]),
          passwordConfirmation: control(["", ["required"]]),
        },
      }),
    ),
  );

  const [appState, appActions, appActions$] = useRxApp();

  const navigate = useNavigate();

  appActions$
    .ofTypes([appActions$.types["[auth] - [login] - signUpSuccess"]])
    .pipe(take(1))
    .subscribe(() => {
      navigate("/verify-email");
    });

  const [formState, formActions] = rxForm;

  return (
    <div>
      <Form rxForm={rxForm}>
        <Field name="name" component={TextInput} label="Username" />
        <Field name="email" component={EmailInput} label="Email" />
        <Field name="password" component={PasswordInput} label="Password" />
        <Field
          name="passwordConfirmation"
          component={PasswordInput}
          label="Confirm Password"
        />
        <button type="button" onClick={() => formActions.resetControl([])}>
          Clear
        </button>
        <button
          type="button"
          disabled={
            appState().auth.signUpReq.loading || !formState().root.valid
          }
          onClick={() => appActions.auth.signUpReq.send(formState().root.value)}
        >
          Submit
        </button>
      </Form>
    </div>
  );
};

export default SignUp;
