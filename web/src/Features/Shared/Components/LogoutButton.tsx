import { useNavigate } from "@solidjs/router";
import { useRxApp } from "./RxAppProvider";
import { take } from "rxjs";

const LogoutButton = () => {
  const [appState, appActions, appActions$] = useRxApp();
  const navigate = useNavigate();

  appActions$
    .ofTypes([appActions$.types["[auth] - [login] - logoutSuccess"]])
    .pipe(take(1))
    .subscribe(() => navigate("/login"));

  return (
    <button
      type="button"
      onClick={appActions.auth.login.logout}
      disabled={appState().auth.login.loggingOut}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
