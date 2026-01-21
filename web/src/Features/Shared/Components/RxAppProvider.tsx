import { createContext, useContext, type JSX } from "solid-js";
import { type HookedReactable } from "../../../reactables/createReactable";
import { RxApp } from "../Rx/RxApp";

const RxAppContext = createContext<HookedReactable<typeof RxApp> | undefined>(
  undefined,
);

type RxAppProviderProps = {
  rxApp: HookedReactable<typeof RxApp>;
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
  return (
    <RxAppContext.Provider value={props.rxApp}>
      {props.children}
    </RxAppContext.Provider>
  );
};

export default RxAppProvider;
