import { useRxApp } from "./RxAppProvider";
import { take } from "rxjs";

const LogoutButton = () => {
  const [appState, appActions, appActions$] = useRxApp();

  appActions$
    .ofTypes([appActions$.types["[auth] - [login] - logoutSuccess"]])
    .pipe(take(1))
    .subscribe(() => (window.location.href = "/login"));

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
