import type { Component } from "solid-js";
import { useContext, createMemo, Show } from "solid-js";
import { ControlModels } from "@reactables/forms";
import { type HookedRxForm } from "./Form";
import { FormContext } from "./FormContext";

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
  component: Component<WrappedFieldProps>;
  name?: string;
  [key: string]: unknown;
}

export const Field = ({
  component: Component,
  name = "root",
  ...props
}: FieldProps) => {
  const rxForm = useContext(FormContext) as HookedRxForm;

  const [state] = rxForm;

  const control = createMemo(
    () => state()?.[name] as ControlModels.FormControl<unknown>,
  );

  const [, { markControlAsTouched, updateValues }] = rxForm;

  return (
    <Show when={control()} fallback={<div>Control Not Found</div>}>
      {(c) => {
        const { value, controlRef, touched } = c();
        const inputProps = {
          name,
          value,
          onBlur: () => {
            if (!touched) markControlAsTouched({ controlRef });
          },
          onChange: (event: Event | unknown) => {
            let value: unknown;
            if ((event as Event).currentTarget) {
              switch (
                ((event as Event).currentTarget as HTMLInputElement).type
              ) {
                case "checkbox":
                  value = ((event as Event).currentTarget as HTMLInputElement)
                    .checked;
                  break;
                case "email":
                case "text":
                default:
                  value = ((event as Event).currentTarget as HTMLInputElement)
                    .value;
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
        return (
          <>
            <Component input={inputProps} meta={c()} {...props} />
          </>
        );
      }}
    </Show>
  );
};
