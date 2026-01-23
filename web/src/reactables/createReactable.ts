import type { Accessor } from "solid-js";
import { createSignal, onCleanup } from "solid-js";

import { Observable } from "rxjs";
import type {
  Reactable,
  ActionObservableWithTypes,
  DestroyAction,
} from "@reactables/core";

export type HookedReactable<T> = T extends (
  ...args: any[]
) => Reactable<infer S, infer U, infer V>
  ? [Accessor<S>, U, ActionObservableWithTypes<V>, Observable<S>]
  : never;

export const createReactable = <
  T,
  S extends DestroyAction,
  U extends unknown[],
  V extends Record<string, string>,
>(
  reactableFactory: (...props: U) => Reactable<T, S, V>,
  ...props: U
): HookedReactable<typeof reactableFactory> => {
  // instantiate the reactable
  const [state$, actions, actions$] = reactableFactory(...props);

  // create a Solid signal for state
  const [state, setState] = createSignal<T>();

  // subscribe signal to state observable
  const stateSub = state$.subscribe(setState);

  // automatically clean up on component unmount
  onCleanup(() => {
    stateSub.unsubscribe();
    actions.destroy?.();
  });

  return [() => state()!, actions, actions$, state$] as const;
};
