import type { JSX } from "solid-js";
import type { WrappedFieldProps } from "../../../../reactables/SolidForms/Field";

interface EmailInputProps extends WrappedFieldProps {
  label?: string | JSX.Element;
  readOnly?: boolean;
}

const EmailInput = (props: EmailInputProps) => {
  return (
    <div class="mb-3">
      {props.label && <label class="form">{props.label}</label>}
      <input
        {...props.input}
        type="text"
        value={props.meta.value}
        readOnly={props.readOnly}
      />
      {props.meta.touched && props.meta.errors.required && (
        <div>
          <small class="text-danger">Field is required</small>
        </div>
      )}
      {props.meta.touched && props.meta.errors.email && (
        <div>
          <small class="text-danger">Please enter a valid email</small>
        </div>
      )}
    </div>
  );
};

export default EmailInput;
