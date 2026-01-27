import "./App.css";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import VerifyEmailNotice from "./Features/Auth/VerifyEmailNotice";
import ApiProvider from "./Features/Shared/Components/ApiProvider";
import MainLayout from "./Features/Shared/Components/MainLayout";
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

  const user = () => appState().auth.user.data;

  return (
    <>
      {appState().auth.login.checkingLoginStatus ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Router>
            <Route
              path="/"
              component={(props) => (
                <Guard
                  when={Boolean(
                    appState().auth.login.isLoggedIn && user()?.emailVerified,
                  )}
                  redirectTo={
                    !appState().auth.login.isLoggedIn
                      ? "/login"
                      : "/verify-email"
                  }
                >
                  <MainLayout {...props} />
                </Guard>
              )}
            >
              <Route path="/" component={() => <h1>Home</h1>} />
              <Route path="/user-settings" component={UserSettings}>
                <Route path="/" component={() => <h3>General Settings</h3>} />
                <Route
                  path="/two-factor-authentication"
                  component={TwoFactorAuthentication}
                />
              </Route>
            </Route>
            <Route
              path="/verify-email"
              component={() => (
                <Guard
                  when={appState().auth.login.isLoggedIn}
                  redirectTo="/login"
                >
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
