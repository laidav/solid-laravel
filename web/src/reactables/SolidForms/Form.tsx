import type { RxFormActions } from "@reactables/forms";
import { ControlModels } from "@reactables/forms";
import type { JSX } from "solid-js";
import { FormContext } from "./FormContext";

export type HookedRxForm = [
  ControlModels.Form<unknown> | undefined,
  RxFormActions,
  ...unknown[],
];
interface FormProps {
  rxForm: HookedRxForm;
  children?: JSX.Element;
}

export const Form = ({ rxForm, children }: FormProps) => {
  return <FormContext.Provider value={rxForm}>{children}</FormContext.Provider>;
};
