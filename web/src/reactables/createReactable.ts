import { createSignal, onCleanup } from "solid-js";

import { Observable } from "rxjs";
import type {
  Reactable,
  ActionObservableWithTypes,
  DestroyAction,
} from "@reactables/core";

export type AccessorWithSelectors<
  State,
  BoundSelectors extends { [key: string]: () => any } = {},
> = (() => State) & {
  select: BoundSelectors;
};

export type BoundSelectorsResult<Selectors> = {
  [K in keyof Selectors]: () => Selectors[K] extends (state: any) => infer P
    ? P
    : never;
};

export type HookedReactable<T, Selectors> = T extends (
  ...args: any[]
) => Reactable<infer State, infer Actions, infer Types>
  ? [
      AccessorWithSelectors<State, BoundSelectorsResult<Selectors>>,
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
    BoundSelectorsResult<Selectors>
  >;

  // bind selectors from the Factory
  const selectors = (reactableFactory.selectors || {}) as Selectors;
  const boundSelectors = Object.entries(selectors).reduce(
    (acc, [key, selector]) => {
      return {
        ...acc,
        [key]: () => selector(state()!),
      };
    },
    {},
  ) as BoundSelectorsResult<Selectors>;

  stateAccessorWithSelectors.select = boundSelectors;

  // subscribe signal to state observable
  const stateSub = state$.subscribe(setState);

  // automatically clean up on component unmount
  onCleanup(() => {
    stateSub.unsubscribe();
    actions.destroy?.();
  });

  return [stateAccessorWithSelectors, actions, actions$, state$] as const;
};
