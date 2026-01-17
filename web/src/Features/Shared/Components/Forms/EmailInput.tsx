import type { JSX } from "solid-js";
import type { WrappedFieldProps } from "../../../../reactables/SolidForms/Field";

export interface InputProps extends WrappedFieldProps {
  label?: string | JSX.Element;
}

const EmailInput = ({ input, meta, label }: InputProps) => {
  return (
    <div class="mb-3">
      {label && <label class="form">{label}</label>}
      <input {...input} type="text" value={meta().value} />
      {meta().touched && meta().errors.required && (
        <div>
          <small class="text-danger">Field is required</small>
        </div>
      )}
      {meta().touched && meta().errors.email && (
        <div>
          <small class="text-danger">Please enter a valid email</small>
        </div>
      )}
    </div>
  );
};

export default EmailInput;
