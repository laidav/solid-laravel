import { type HookedRxForm } from "./Form";
import { createContext, type Context } from "solid-js";

export const FormContext =
  createContext<HookedRxForm>() as Context<HookedRxForm>;
