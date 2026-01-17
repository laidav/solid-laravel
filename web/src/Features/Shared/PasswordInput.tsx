import type { JSX } from "solid-js";
import type { WrappedFieldProps } from "../../reactables/SolidForms/Field";

export interface InputProps extends WrappedFieldProps {
  label?: string | JSX.Element;
}

const PasswordInput = ({ input, meta, label }: InputProps) => {
  return (
    <div class="mb-3">
      {label && <label class="form">{label}</label>}
      <input {...input} value={meta().value} type="password" />
      {meta().touched && meta().errors.required && (
        <div>
          <small class="text-danger">Field is required</small>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
