import "./App.css";
import { Show } from "solid-js";
import { Route, Router } from "@solidjs/router";
import SignUp from "../Features/Auth/SignUp";
import VerifyEmailNotice from "../Features/Auth/VerifyEmailNotice";
import ApiProvider from "../Shared/Components/ApiProvider";
import MainLayout from "../Shared/Components/MainLayout";
import Login from "../Features/Auth/Login";
import TwoFactorChallenge from "../Features/Auth/TwoFactorChallenge";
import ForgotPassword from "../Features/Auth/ForgotPassword";
import ResetPassword from "../Features/Auth/ResetPassword";
import UserSettings from "../Features/UserSettings/UserSettings";
import UserProfile from "../Features/UserSettings/UserProfile";
import TwoFactorAuthentication from "../Features/UserSettings/TwoFactorAuthentication";
import RxAppProvider from "../Shared/Components/RxAppProvider";
import { useRxApp } from "../Shared/Components/RxAppProvider";
import Guard from "../Shared/Components/Guard";

function App() {
  const [{ select }] = useRxApp();

  return (
    <>
      <Show
        when={!select.isCheckingLoginStatus()}
        fallback={<div>Loading...</div>}
      >
        <div>
          <Router>
            {/* Public Routes */}
            <Route path="/sign-up" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route
              path="/two-factor-challenge"
              component={TwoFactorChallenge}
            />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <Route path="/login" component={() => <h1>Login</h1>} />
            {/* Guarded Routes */}
            <Route
              path="/verify-email"
              component={() => (
                <Guard when={select.isLoggedIn()} redirectTo="/login">
                  <VerifyEmailNotice />
                </Guard>
              )}
            />
            <Show when={select.userLoaded()}>
              <>
                <Route
                  path="/"
                  component={(props) => (
                    <Guard
                      when={Boolean(select.userVerified())}
                      redirectTo={
                        !select.isLoggedIn() ? "/login" : "/verify-email"
                      }
                    >
                      <MainLayout {...props} />
                    </Guard>
                  )}
                >
                  <Route path="/" component={() => <h1>Home</h1>} />
                  <Route path="/user-settings" component={UserSettings}>
                    <Route path="/" component={UserProfile} />
                    <Route
                      path="/two-factor-authentication"
                      component={TwoFactorAuthentication}
                    />
                  </Route>
                </Route>
              </>
            </Show>
          </Router>
        </div>
      </Show>
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
