import { take } from "rxjs/operators";
import { useNavigate, A } from "@solidjs/router";
import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Field } from "../../reactables/SolidForms/Field";
import EmailInput from "../Shared/Components/Forms/EmailInput";
import PasswordInput from "../Shared/Components/Forms/PasswordInput";
import { Form } from "../../reactables/SolidForms/Form";
import { useRxApp } from "../Shared/Components/RxAppProvider";

export interface LoginFormValue {
  email: string;
  password: string;
}

const Login = () => {
  const rxLoginForm = createReactable(() =>
    build<LoginFormValue>(
      group({
        controls: {
          email: control(["", ["required", "email"]]),
          password: control(["", ["required"]]),
        },
      }),
    ),
  );

  const navigate = useNavigate();

  const [appState, appActions, appActions$] = useRxApp();
  const [formState] = rxLoginForm;

  appActions$
    .ofTypes([appActions$.types["[auth] - loginSuccess"]])
    .pipe(take(1))
    .subscribe(() => {
      navigate("/home");
    });

  return (
    <div>
      {appState().auth.lockedOut ? (
        <h1>Sorry too many log in attempts. Please try again later.</h1>
      ) : (
        <Form rxForm={rxLoginForm}>
          <Field name="email" component={EmailInput} label="Email" />
          <Field name="password" component={PasswordInput} label="Password" />
          <button
            disabled={appState().auth.loggingIn || !formState().root.valid}
            onClick={() => appActions.auth.login(formState().root.value)}
          >
            Login
          </button>
        </Form>
      )}
      <br />
      <A href="/forgot-password">Forgot Password?</A>
    </div>
  );
};

export default Login;
