import { useRxApp } from "./RxAppProvider";
import { take } from "rxjs";

const LogoutButton = () => {
  const [{ select }, appActions, appActions$] = useRxApp();

  appActions$
    .ofTypes([appActions$.types["[auth] - [login] - logoutSuccess"]])
    .pipe(take(1))
    //Reloading app to safely clear state in app.
    .subscribe(() => (window.location.href = "/login"));

  return (
    <button
      type="button"
      onClick={appActions.auth.login.logout}
      disabled={select.isLoggingOut()}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
