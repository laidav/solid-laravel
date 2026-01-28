import { createContext, type JSX, useContext } from "solid-js";
import API from "../../Services/API";

export const ApiContext = createContext<
  { apiWithCredentials: API; apiNoCredentials: API } | undefined
>();

export const ApiProvider = (props: { children: JSX.Element }) => (
  <ApiContext.Provider
    value={{ apiWithCredentials: new API(), apiNoCredentials: new API(false) }}
  >
    {props.children}
  </ApiContext.Provider>
);

export const useApi = (withCredentials = true) => {
  const { apiWithCredentials, apiNoCredentials } = useContext(ApiContext)!;

  return withCredentials ? apiWithCredentials : apiNoCredentials;
};

export default ApiProvider;
