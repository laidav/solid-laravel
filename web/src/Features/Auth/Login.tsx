import { A } from "@solidjs/router";
import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Field } from "../../reactables/SolidForms/Field";
import EmailInput from "../../Shared/Components/Forms/EmailInput";
import PasswordInput from "../../Shared/Components/Forms/PasswordInput";
import { Form } from "../../reactables/SolidForms/Form";
import { useRxApp } from "../../Shared/Components/RxAppProvider";
import { useNavigateOnAction } from "../../Shared/Composables/useNavigationOnAction";

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

  const [appState, appActions, appActions$] = useRxApp();
  const [formState] = rxLoginForm;

  useNavigateOnAction([
    {
      on: appActions$.types["[auth] - [login] - loginSuccess"],
      navigateTo: "/",
    },
    {
      on: appActions$.types["[auth] - [login] - twoFactorRequired"],
      navigateTo: "/two-factor-challenge",
    },
  ]);

  return (
    <div>
      {appState().auth.login.lockedOut ? (
        <h1>Sorry too many log in attempts. Please try again later.</h1>
      ) : (
        <Form rxForm={rxLoginForm}>
          <Field name="email" component={EmailInput} label="Email" />
          <Field name="password" component={PasswordInput} label="Password" />
          <button
            disabled={
              appState().auth.login.loggingIn || !formState().root.valid
            }
            onClick={() => appActions.auth.login.login(formState().root.value)}
          >
            Login
          </button>
        </Form>
      )}
      <br />
      <A href="/forgot-password">Forgot Password?</A>
      <br />
      <strong>OR</strong>
      <br />
      <A href="/sign-up">Sign Up</A>
    </div>
  );
};

export default Login;
