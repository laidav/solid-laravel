import type { RxFormActions } from "@reactables/forms";
import { ControlModels } from "@reactables/forms";
import type { JSX, Accessor } from "solid-js";
import { FormContext } from "./FormContext";

export type HookedRxForm = [
  Accessor<ControlModels.Form<unknown>>,
  RxFormActions,
  ...unknown[],
];
interface FormProps {
  rxForm: HookedRxForm;
  children?: JSX.Element;
}

export const Form = (props: FormProps) => {
  return (
    <FormContext.Provider value={props.rxForm}>
      {props.children}
    </FormContext.Provider>
  );
};
