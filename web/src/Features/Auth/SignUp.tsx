import { build, group, control } from "@reactables/forms";
import { createReactable } from "../../reactables/createReactable";
import { Form } from "../../reactables/SolidForms/Form";
import { Field } from "../../reactables/SolidForms/Field";
import TextInput from "../Shared/TextInput";
import EmailInput from "../Shared/EmailInput";
import PasswordInput from "../Shared/PasswordInput";
import { useContext } from "solid-js";
import { FormContext } from "../../reactables/SolidForms/FormContext";

const SignUp = () => {
  const [state, actions] = createReactable(() =>
    build(
      group({
        controls: {
          name: control(["", "required"]),
          email: control(["", ["required", "email"]]),
          password: control(["", ["required"]]),
          confirmPassword: control(["", ["required"]]),
        },
      }),
    ),
  );

  console.log(state());

  return (
    <div>
      <FormContext.Provider value={[state(), actions]}>
        <Field name="name" component={TextInput} label="Username" />
        <Field name="email" component={EmailInput} label="Email" />
        <Field name="password" component={PasswordInput} label="Password" />
        <Field
          name="confirmPassword"
          component={PasswordInput}
          label="Confirm Password"
        />
      </FormContext.Provider>
    </div>
  );
};

export default SignUp;
