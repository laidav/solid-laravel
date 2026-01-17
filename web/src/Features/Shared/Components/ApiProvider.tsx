import { createContext, JSX, useContext } from "solid-js";
import API from "../../../Services/API";

export const ApiContext = createContext<
  { authenticatedApi: API; unautheticatedApi: API } | undefined
>();

export const ApiProvider = (props: { children: JSX.Element }) => (
  <ApiContext.Provider
    value={{ authenticatedApi: new API(), unautheticatedApi: new API(false) }}
  >
    {props.children}
  </ApiContext.Provider>
);

export const useApi = (authenticated = true) => {
  const { unautheticatedApi, authenticatedApi } = useContext(ApiContext)!;

  return authenticated ? authenticatedApi : unautheticatedApi;
};

export default ApiProvider;
