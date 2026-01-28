import { useNavigate } from "@solidjs/router";
import { take } from "rxjs/operators";
import { createReactable } from "../../reactables/createReactable";
import { build, group, control } from "@reactables/forms";
import TextInput from "../../Shared/Components/Forms/TextInput";
import { Form } from "../../reactables/SolidForms/Form";
import { Field } from "../../reactables/SolidForms/Field";
import { useRxApp } from "../../Shared/Components/RxAppProvider";
import { A } from "@solidjs/router";

const TwoFactorChallenge = () => {
  const rxForm = createReactable(() =>
    build<{ code: string }>(
      group({
        controls: {
          code: control(["", "required"]),
        },
      }),
    ),
  );

  const [appState, appActions, appActions$] = useRxApp();

  const [formState] = rxForm;

  const navigate = useNavigate();

  appActions$
    .ofTypes([appActions$.types["[auth] - [login] - loginSuccess"]])
    .pipe(take(1))
    .subscribe(() => {
      navigate("/");
    });

  return (
    <Form rxForm={rxForm}>
      <h3>Enter the verification code.</h3>
      <Field name="code" component={TextInput} label="Code" />
      <button
        disabled={appState().auth.login.loggingIn || !formState().root.valid}
        onClick={() =>
          appActions.auth.login.twoFactorChallenge(formState().root.value)
        }
      >
        Submit
      </button>
      <br />
      <strong>OR</strong>
      <A href="/login">Back to Login</A>
    </Form>
  );
};

export default TwoFactorChallenge;
