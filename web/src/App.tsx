import "./App.css";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import VerifyEmailNotice from "./Features/Auth/VerifyEmailNotice";
import ApiProvider from "./Features/Shared/Components/ApiProvider";
import Home from "./Features/Shared/Components/Home";
import Login from "./Features/Auth/Login";
import ForgotPassword from "./Features/Auth/ForgotPassword";
import ResetPassword from "./Features/Auth/ResetPassword";
import RxAppProvider from "./Features/Shared/Components/RxAppProvider";
import { useRxApp } from "./Features/Shared/Components/RxAppProvider";
import { GuardedRoute } from "./Features/Shared/Components/GuardedRoute";

function App() {
  const [appState] = useRxApp();

  return (
    <>
      {appState().auth.checkingLoginStatus ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Router>
            <Route path="/" component={() => <h1>Starter App</h1>} />
            <GuardedRoute
              path="/verify-email"
              component={VerifyEmailNotice}
              when={appState().auth.isLoggedIn}
              redirectTo="/login"
            />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <GuardedRoute
              path="/home"
              component={Home}
              when={Boolean(
                appState().auth.isLoggedIn &&
                appState().auth.currentUser?.emailVerified,
              )}
              redirectTo={
                !appState().auth.isLoggedIn ? "/login" : "/verify-email"
              }
            />
            <Route path="/login" component={() => <h1>Login</h1>} />
          </Router>
        </div>
      )}
    </>
  );
}

export default () => (
  <ApiProvider>
    <RxAppProvider>
      <App />
    </RxAppProvider>
  </ApiProvider>
);
