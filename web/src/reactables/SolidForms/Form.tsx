import type { RxFormActions } from "@reactables/forms";
import { ControlModels } from "@reactables/forms";
import { createContext, createMemo, Show } from "solid-js";
import type { JSX, Accessor } from "solid-js";

export type HookedRxForm = [
  Accessor<ControlModels.Form<unknown> | undefined>,
  RxFormActions,
  ...unknown[],
];

export const FormContext = createContext<HookedRxForm>();

interface FormProps {
  rxForm: HookedRxForm;
  children?: JSX.Element;
}

export const Form = ({ rxForm, children }: FormProps) => {
  const [state] = rxForm;
  const stateInitialized = createMemo(() => state() !== undefined, undefined);

  return (
    <Show when={stateInitialized()}>
      <FormContext.Provider value={rxForm}>{children}</FormContext.Provider>
    </Show>
  );
};
