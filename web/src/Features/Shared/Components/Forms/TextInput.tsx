import type { JSX } from "solid-js";
import type { WrappedFieldProps } from "../../../../reactables/SolidForms/Field";

export interface InputProps extends WrappedFieldProps {
  label?: string | JSX.Element;
}

const TextInput = (props: InputProps) => {
  return (
    <div class="mb-3">
      {props.label && (
        <label for={props.input.id} class="form">
          {props.label}
        </label>
      )}
      <input {...props.input} value={props.meta.value} type="text" />
      {props.meta.touched && props.meta.errors.required && (
        <div>
          <small class="text-danger">Field is required</small>
        </div>
      )}
    </div>
  );
};

export default TextInput;
