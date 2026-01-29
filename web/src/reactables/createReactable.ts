import { createSignal, onCleanup } from "solid-js";

import { Observable } from "rxjs";
import type {
  Reactable,
  ActionObservableWithTypes,
  DestroyAction,
  ReactableState,
} from "@reactables/core";

type AccessorWithSelectors<
  State,
  Selectors extends { [key: string]: (state: State) => any } = {},
> = (() => State) & {
  select: Selectors;
};

export type HookedReactable<T, Selectors> = T extends (
  ...args: any[]
) => Reactable<infer State, infer Actions, infer Types>
  ? [
      AccessorWithSelectors<
        State,
        { [K in keyof Selectors]: (state: State) => any }
      >,
      Actions,
      ActionObservableWithTypes<Types>,
      Observable<State>,
    ]
  : never;

export const createReactable = <
  State,
  Actions extends DestroyAction,
  Types extends Record<string, string>,
  Props extends unknown[],
  Selectors extends { [key: string]: (state: State) => any },
>(
  reactableFactory: ((...props: Props) => Reactable<State, Actions, Types>) & {
    selectors?: Selectors;
  },
  ...props: Props
): HookedReactable<typeof reactableFactory, Selectors> => {
  // instantiate the reactable
  const [state$, actions, actions$] = reactableFactory(...props);

  // create a Solid signal for state
  const [state, setState] = createSignal<State>();

  const stateAccessorWithSelectors = (() => state()!) as AccessorWithSelectors<
    State,
    Selectors
  >;

  // bind selectors from the Factory
  const selectors = reactableFactory.selectors || {};
  stateAccessorWithSelectors.select = (selectors || {}) as Selectors;

  // subscribe signal to state observable
  const stateSub = state$.subscribe(setState);

  // automatically clean up on component unmount
  onCleanup(() => {
    stateSub.unsubscribe();
    actions.destroy?.();
  });

  return [stateAccessorWithSelectors, actions, actions$, state$] as const;
};
