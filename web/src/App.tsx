import "./App.css";
import { Show } from "solid-js";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import VerifyEmailNotice from "./Features/Auth/VerifyEmailNotice";
import ApiProvider from "./Features/Shared/Components/ApiProvider";
import Home from "./Features/Shared/Components/Home";
import RxAppProvider from "./Features/Shared/Components/RxAppProvider";
import { useRxApp } from "./Features/Shared/Components/RxAppProvider";
import { GuardedRoute } from "./Features/Shared/Components/GuardedRoute";

function App() {
  const [appState] = useRxApp();

  return (
    <Show when={appState()}>
      {(s) => (
        <>
          {s()?.auth.login.checkingLoginStatus ? (
            <div>Loading...</div>
          ) : (
            <div>
              <Router>
                <Route path="/" component={() => <h1>Starter App</h1>} />
                <GuardedRoute
                  path="/verify-email"
                  component={VerifyEmailNotice}
                  when={appState()!.auth.login.isLoggedIn}
                  redirectTo="/login"
                />
                <Route path="/sign-up" component={SignUp} />
                <GuardedRoute
                  path="/home"
                  component={Home}
                  when={Boolean(
                    appState()!.auth.login.isLoggedIn &&
                    appState()!.auth.login.currentUser?.emailVerified,
                  )}
                  redirectTo={
                    !appState()!.auth.login.isLoggedIn
                      ? "/login"
                      : "/verify-email"
                  }
                />
                <Route path="/login" component={() => <h1>Login</h1>} />
              </Router>
            </div>
          )}
        </>
      )}
    </Show>
  );
}

export default () => (
  <ApiProvider>
    <RxAppProvider>
      <App />
    </RxAppProvider>
  </ApiProvider>
);
