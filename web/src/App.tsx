import "./App.css";
import { Show } from "solid-js";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import VerifyEmailNotice from "./Features/Auth/VerifyEmailNotice";
import ApiProvider from "./Features/Shared/Components/ApiProvider";
import Home from "./Features/Shared/Components/Home";
import RxAppProvider from "./Features/Shared/Components/RxAppProvider";
import { createReactable } from "./reactables/createReactable";
import { AuthService } from "./Services/authService";
import { useApi } from "./Features/Shared/Components/ApiProvider";
import { RxApp } from "./Features/Shared/Rx/RxApp";
import { GuardedRoute } from "./Features/Shared/Components/GuardedRoute";

function App() {
  const api = useApi();
  const rxApp = createReactable(() => {
    const authService = AuthService(api);
    return RxApp({ authService });
  });

  const [appState] = rxApp;

  return (
    <Show when={appState()}>
      {(s) => (
        <>
          {s()?.auth.checkingLoginStatus ? (
            <div>Loading...</div>
          ) : (
            <RxAppProvider rxApp={rxApp}>
              <div>
                <Router>
                  <Route path="/" component={() => <h1>Starter App</h1>} />
                  <GuardedRoute
                    path="/verify-email"
                    component={VerifyEmailNotice}
                    when={appState()!.auth.isLoggedIn}
                    redirectTo="/login"
                  />
                  <Route path="/sign-up" component={SignUp} />
                  <Route path="/home" component={Home} />
                  <Route path="/login" component={() => <h1>Login</h1>} />
                </Router>
              </div>
            </RxAppProvider>
          )}
        </>
      )}
    </Show>
  );
}

export default () => (
  <ApiProvider>
    <App />
  </ApiProvider>
);
