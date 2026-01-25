import "./App.css";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import VerifyEmailNotice from "./Features/Auth/VerifyEmailNotice";
import ApiProvider from "./Features/Shared/Components/ApiProvider";
import Home from "./Features/Shared/Components/Home";
import Login from "./Features/Auth/Login";
import ForgotPassword from "./Features/Auth/ForgotPassword";
import ResetPassword from "./Features/Auth/ResetPassword";
import UserSettings from "./Features/UserSettings/UserSettings";
import TwoFactorAuthentication from "./Features/UserSettings/TwoFactorAuthentication";
import RxAppProvider from "./Features/Shared/Components/RxAppProvider";
import { useRxApp } from "./Features/Shared/Components/RxAppProvider";
import Guard from "./Features/Shared/Components/Guard";

function App() {
  const [appState] = useRxApp();

  return (
    <>
      {appState().auth.checkingLoginStatus ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Router>
            <Route
              path="/"
              component={(props) => (
                <Guard
                  when={Boolean(
                    appState().auth.isLoggedIn &&
                    appState().auth.currentUser?.emailVerified,
                  )}
                  redirectTo={
                    !appState().auth.isLoggedIn ? "/login" : "/verify-email"
                  }
                >
                  <Home {...props} />
                </Guard>
              )}
            >
              <Route path="/" component={() => <h1>Home</h1>} />
              <Route path="/user-settings" component={UserSettings}>
                <Route path="/" component={() => <h1>General Settings</h1>} />
                <Route
                  path="/two-factor-authentication"
                  component={TwoFactorAuthentication}
                />
              </Route>
            </Route>
            <Route
              path="/verify-email"
              component={() => (
                <Guard when={appState().auth.isLoggedIn} redirectTo="/login">
                  <VerifyEmailNotice />
                </Guard>
              )}
            />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />
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
