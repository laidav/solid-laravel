import { combine } from "@reactables/core";
import { Show } from "solid-js";
import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Field } from "../../reactables/SolidForms/Field";
import TextInput from "../Shared/Components/Forms/TextInput";
import EmailInput from "../Shared/Components/Forms/EmailInput";
import PasswordInput from "../Shared/Components/Forms/PasswordInput";
import { Form } from "../../reactables/SolidForms/Form";
import { RxRequest } from "../Shared/Rx/RxRequest";
import { createUser, type CreateUserPayload } from "../../Services/authService";

const SignUp = () => {
  const [state, actions] = createReactable(() =>
    combine({
      form: build<{
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
      }>(
        group({
          controls: {
            name: control(["", "required"]),
            email: control(["", ["required", "email"]]),
            password: control(["", ["required"]]),
            confirmPassword: control(["", ["required"]]),
          },
        }),
      ),
      request: RxRequest<CreateUserPayload, { userId: number }>({
        resource: createUser,
      }),
    }),
  );

  const getPayload = (): CreateUserPayload => {
    const { confirmPassword, ...fields } = state()!.form.root.value;
    return {
      ...fields,
      password_confirmation: confirmPassword,
    };
  };

  return (
    <Show when={state()}>
      {(s) => (
        <>
          {s().request.success ? (
            <h1>
              User created! Please check your email and verify your account.
            </h1>
          ) : (
            <div>
              <Form rxForm={[() => s().form, actions.form]}>
                <Field name="name" component={TextInput} label="Username" />
                <Field name="email" component={EmailInput} label="Email" />
                <Field
                  name="password"
                  component={PasswordInput}
                  label="Password"
                />
                <Field
                  name="confirmPassword"
                  component={PasswordInput}
                  label="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => actions.form.resetControl([])}
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={s().request.loading || !s().form.root.valid}
                  onClick={() => actions.request.send(getPayload())}
                >
                  Submit
                </button>
              </Form>
            </div>
          )}
        </>
      )}
    </Show>
  );
};

export default SignUp;
