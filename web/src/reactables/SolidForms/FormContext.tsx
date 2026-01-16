import { type HookedRxForm } from "./Form";
import { createContext } from "solid-js";

export const FormContext = createContext<HookedRxForm | undefined>();
