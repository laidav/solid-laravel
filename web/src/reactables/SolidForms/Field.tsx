import type { Component, JSX } from "solid-js";
import { useContext, createMemo } from "solid-js";
import { ControlModels } from "@reactables/forms";
import { FormContext } from "./Form";

export type EventHandler<Event> = (event: Event, name?: string) => void;

export interface CommonFieldInputProps {
  name: string;
  //TODO: these drag drop and focus events
  onDragStart?: EventHandler<DragEvent>;
  onDrop?: EventHandler<DragEvent>;
  onFocus?: EventHandler<FocusEvent>;
}

export interface EventOrValueHandler<Event> extends EventHandler<Event> {
  (value: unknown): void;
}

export interface WrappedFieldInputProps extends CommonFieldInputProps {
  value: any;
  onBlur: EventOrValueHandler<FocusEvent>;
  onChange: EventOrValueHandler<Event>;
}

export interface WrappedFieldProps {
  input: WrappedFieldInputProps;
  meta: ControlModels.FormControl<unknown>;
}

export interface FieldProps {
  component: () => Component;
  name?: string;
  [key: string]: unknown;
}

export const Field = ({
  component: Component,
  name = "root",
  ...props
}: FieldProps) => {
  const rxForm = useContext(FormContext);
  const stateInitialized = createMemo(() => state() !== undefined, undefined);

  if (!rxForm || !stateInitialized()) return;

  const [state] = rxForm;
  const control = createMemo(
    () => state()?.[name] as ControlModels.FormControl<unknown>,
  );

  if (!control()) {
    throw `Control '${name}' can not be found`;
  }

  const { controlRef, touched, value } = control();

  const [, { markControlAsTouched }] = rxForm;

  const inputProps = {
    name,
    value,
    onBlur: () => {
      if (!touched) markControlAsTouched({ controlRef });
    },
    onChange: (event: Event | unknown) => {
      let value: unknown;
      if ((event as FormEvent<HTMLInputElement>).currentTarget) {
        switch ((event as FormEvent<HTMLInputElement>).currentTarget.type) {
          case "checkbox":
            value = (event as FormEvent<HTMLInputElement>).currentTarget
              .checked;
            break;
          case "email":
          case "text":
          default:
            value = (event as FormEvent<HTMLInputElement>).currentTarget.value;
        }
      } else {
        value = event;
      }

      updateValues({
        controlRef,
        value,
      });
    },
  };

  return <Component input={inputProps} meta={state[name]} {...props} />;
};
