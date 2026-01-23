import { createContext, useContext, type JSX, Show } from "solid-js";
import { type HookedReactable } from "../../../reactables/createReactable";
import { RxApp } from "../Rx/RxApp";
import { AuthService } from "../../../Services/authService";
import { useApi } from "./ApiProvider";
import { createReactable } from "../../../reactables/createReactable";

const RxAppContext = createContext<HookedReactable<typeof RxApp> | undefined>(
  undefined,
);

type RxAppProviderProps = {
  children: JSX.Element;
};

export function useRxApp(): HookedReactable<typeof RxApp> {
  const context = useContext(RxAppContext);

  if (!context) {
    throw new Error("useRxApp must be used within an RxAppProvider");
  }
  return context;
}

const RxAppProvider = (props: RxAppProviderProps) => {
  const api = useApi();
  const rxApp = createReactable(() => {
    const authService = AuthService(api);
    return RxApp({ authService });
  });
  return (
    <RxAppContext.Provider value={rxApp}>
      {props.children}
    </RxAppContext.Provider>
  );
};

export default RxAppProvider;
