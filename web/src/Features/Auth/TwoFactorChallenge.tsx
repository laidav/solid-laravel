import { createReactable } from "../../reactables/createReactable";
import { build, group, control } from "@reactables/forms";
import TextInput from "../../Shared/Components/Forms/TextInput";
import { Form } from "../../reactables/SolidForms/Form";
import { Field } from "../../reactables/SolidForms/Field";
import { useRxApp } from "../../Shared/Components/RxAppProvider";
import { A } from "@solidjs/router";
import { useNavigateOnAction } from "../../Shared/Composables/useNavigationOnAction";

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

  const [{ select }, appActions, appActions$] = useRxApp();

  const [formState] = rxForm;

  useNavigateOnAction([
    {
      on: appActions$.types["[auth] - [login] - loginSuccess"],
      navigateTo: "/",
    },
  ]);

  return (
    <Form rxForm={rxForm}>
      <h3>Enter the verification code.</h3>
      <Field name="code" component={TextInput} label="Code" />
      <button
        disabled={select.isLoggingIn() || !formState().root.valid}
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
