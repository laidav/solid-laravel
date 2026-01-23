import type { Component } from "solid-js";
import { useContext, createMemo, Show, type Accessor } from "solid-js";
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
  onBlur: EventOrValueHandler<FocusEvent>;
  onInput: EventOrValueHandler<Event>;
}

export interface WrappedFieldProps {
  input: WrappedFieldInputProps;
  meta: Accessor<ControlModels.FormControl<string>>;
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
  const rxForm = useContext(FormContext);

  const c = createMemo(() => {
    const [state] = rxForm;

    return state()[name] as ControlModels.FormControl<string>;
  });

  const a = createMemo(() => {
    const [, actions] = rxForm;
    return actions;
  });

  return (
    <Show when={c()} fallback={<div>Control Not Found</div>}>
      {(c) => {
        const { controlRef } = c();
        const inputProps = {
          name,
          onBlur: () => {
            if (!c().touched) a().markControlAsTouched({ controlRef });
          },
          onInput: (event: Event | unknown) => {
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

            a().updateValues({
              controlRef,
              value,
            });
          },
        };
        return (
          <>
            <Component input={inputProps} meta={c} {...props} />
          </>
        );
      }}
    </Show>
  );
};
