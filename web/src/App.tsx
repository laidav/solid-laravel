import "./App.css";
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

function App() {
  const api = useApi();
  const rxApp = createReactable(() => {
    const authService = AuthService(api);
    return RxApp({ authService });
  });

  return (
    <RxAppProvider rxApp={rxApp}>
      <div>
        <Router>
          <Route path="/" component={() => <h1>Starter App</h1>} />
          <Route path="/verify-email" component={VerifyEmailNotice} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/home" component={Home} />
        </Router>
      </div>
    </RxAppProvider>
  );
}

export default () => (
  <ApiProvider>
    <App />
  </ApiProvider>
);
