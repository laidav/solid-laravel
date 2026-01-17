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
  const rxForm = createReactable(() =>
    build<{
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
      { debug: true },
    ),
  );

  const [formState, formActions] = rxForm;

  const [reqState, reqActions] = createReactable(
    RxRequest<CreateUserPayload, number>,
    {
      resource: createUser,
    },
  );

  const getPayload = (): CreateUserPayload => {
    const {
      root: {
        value: { confirmPassword, ...fields },
      },
    } = formState()!;
    const payload = {
      ...fields,
      password_confirmation: confirmPassword,
    };
    return payload;
  };

  return (
    <>
      {reqState()?.success ? (
        <h1>User created! Please check your email and verify your account.</h1>
      ) : (
        <div>
          <Form rxForm={rxForm}>
            <Field name="name" component={TextInput} label="Username" />
            <Field name="email" component={EmailInput} label="Email" />
            <Field name="password" component={PasswordInput} label="Password" />
            <Field
              name="confirmPassword"
              component={PasswordInput}
              label="Confirm Password"
            />
            <button type="button" onClick={() => formActions.resetControl([])}>
              Clear
            </button>
            <button
              type="button"
              disabled={reqState()?.loading || !formState()?.root.valid}
              onClick={() => reqActions.send(getPayload())}
            >
              Submit
            </button>
          </Form>
        </div>
      )}
    </>
  );
};

export default SignUp;
