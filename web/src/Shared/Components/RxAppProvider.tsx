import { createContext, useContext, type JSX } from "solid-js";
import { type HookedReactable } from "../../reactables/createReactable";
import RxApp from "../../App/RxApp/RxApp";
import { AuthService } from "../../Services/AuthService";
import { useApi } from "./ApiProvider";
import { createReactable } from "../../reactables/createReactable";

type HookedRxApp = HookedReactable<typeof RxApp, typeof RxApp.selectors>;

const RxAppContext = createContext<HookedRxApp | undefined>(undefined);

type RxAppProviderProps = {
  children: JSX.Element;
};

export function useRxApp(): HookedRxApp {
  const context = useContext(RxAppContext);

  if (!context) {
    throw new Error("useRxApp must be used within an RxAppProvider");
  }
  return context;
}

const RxAppProvider = (props: RxAppProviderProps) => {
  const rxApp = createReactable(RxApp, { authService: AuthService(useApi()) });

  return (
    <RxAppContext.Provider value={rxApp}>
      {props.children}
    </RxAppContext.Provider>
  );
};

export default RxAppProvider;
