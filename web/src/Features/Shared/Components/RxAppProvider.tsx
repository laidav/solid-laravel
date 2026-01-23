import { type ReactableState } from "@reactables/core";
import {
  createContext,
  useContext,
  type JSX,
  Show,
  type Accessor,
} from "solid-js";
import { type HookedReactable } from "../../../reactables/createReactable";
import { RxApp } from "../Rx/RxApp";
import { AuthService } from "../../../Services/authService";
import { useApi } from "./ApiProvider";
import { createReactable } from "../../../reactables/createReactable";

type RxAppState = ReactableState<typeof RxApp>;
type HookedRxApp = HookedReactable<typeof RxApp>;
type HookedInitializedRxApp = [
  Accessor<RxAppState>,
  HookedRxApp[1],
  HookedRxApp[2],
  HookedRxApp[3],
];

const RxAppContext = createContext<HookedInitializedRxApp | undefined>(
  undefined,
);

type RxAppProviderProps = {
  children: JSX.Element;
};

export function useRxApp(): HookedInitializedRxApp {
  const context = useContext(RxAppContext);

  if (!context) {
    throw new Error("useRxApp must be used within an RxAppProvider");
  }
  return context;
}

const RxAppProvider = (props: RxAppProviderProps) => {
  const api = useApi();
  const [appState, appActions, appActions$, appState$] = createReactable(() => {
    const authService = AuthService(api);
    return RxApp({ authService });
  });

  return (
    <Show when={appState()}>
      {(s) => (
        <RxAppContext.Provider value={[s, appActions, appActions$, appState$]}>
          {props.children}
        </RxAppContext.Provider>
      )}
    </Show>
  );
};

export default RxAppProvider;
