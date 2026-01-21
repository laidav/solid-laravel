import { combine } from "@reactables/core";
import { take } from "rxjs/operators";
import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Field } from "../../reactables/SolidForms/Field";
import TextInput from "../Shared/Components/Forms/TextInput";
import EmailInput from "../Shared/Components/Forms/EmailInput";
import PasswordInput from "../Shared/Components/Forms/PasswordInput";
import { Form } from "../../reactables/SolidForms/Form";
import { RxRequest } from "../Shared/Rx/RxRequest";
import { AuthService } from "../../Services/authService";
import { useApi } from "../Shared/Components/ApiProvider";

export interface CreateUserFormValue {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp = () => {
  const [state, actions, actions$] = createReactable(() => {
    const authService = AuthService(useApi());

    return combine({
      form: build<CreateUserFormValue>(
        group({
          controls: {
            name: control(["", "required"]),
            email: control(["", ["required", "email"]]),
            password: control(["", ["required"]]),
            passwordConfirmation: control(["", ["required"]]),
          },
        }),
      ),
      request: RxRequest<CreateUserFormValue, { userId: number }>({
        resource: authService.createUser,
      }),
    });
  });

  const navigate = useNavigate();

  actions$
    .ofTypes([actions$.types["[request] - sendSuccess"]])
    .pipe(take(1))
    .subscribe(() => {
      navigate("/verify-email");
    });

  return (
    <Show when={state()}>
      {(s) => (
        <div>
          <Form rxForm={[() => s().form, actions.form]}>
            <Field name="name" component={TextInput} label="Username" />
            <Field name="email" component={EmailInput} label="Email" />
            <Field name="password" component={PasswordInput} label="Password" />
            <Field
              name="passwordConfirmation"
              component={PasswordInput}
              label="Confirm Password"
            />
            <button type="button" onClick={() => actions.form.resetControl([])}>
              Clear
            </button>
            <button
              type="button"
              disabled={s().request.loading || !s().form.root.valid}
              onClick={() => actions.request.send(state()!.form.root.value)}
            >
              Submit
            </button>
          </Form>
        </div>
      )}
    </Show>
  );
};

export default SignUp;
