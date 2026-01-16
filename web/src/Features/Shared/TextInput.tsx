import type { JSX } from "solid-js";
import type { WrappedFieldProps } from "../../reactables/SolidForms/Field";

export interface InputProps extends WrappedFieldProps {
  label?: string | JSX.Element;
}

const TextInput = ({ input, meta: { touched, errors }, label }: InputProps) => {
  return (
    <div class="mb-3">
      {label && <label class="form">{label}</label>}
      <input {...input} type="text" />
      {touched && errors.required && (
        <div>
          <small class="text-danger">Field is required</small>
        </div>
      )}
    </div>
  );
};

export default TextInput;
