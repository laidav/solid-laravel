import { Show } from "solid-js";
import { A, type RouteSectionProps } from "@solidjs/router";
import { AuthService } from "../../../Services/AuthService";
import { useApi } from "./ApiProvider";
import LogoutButton from "./LogoutButton";
import ConfirmPasswordModal from "./ConfirmPasswordModal";
import { useRxApp } from "./RxAppProvider";

const MainLayout = (props: RouteSectionProps) => {
  AuthService(useApi()).testAuthenticatedRoute().then(console.log);
  const [appState] = useRxApp();

  const twoFactorRequiresPassword = () => {
    const {
      auth: {
        twoFactorAuthentication: {
          enable,
          disable,
          getQrCode,
          confirm,
          recoveryCodes,
          regenerateRecoveryCodes,
        },
      },
    } = appState();

    return (
      enable.requiresPasswordConfirmation ||
      disable.requiresPasswordConfirmation ||
      getQrCode.requiresPasswordConfirmation ||
      confirm.requiresPasswordConfirmation ||
      recoveryCodes.requiresPasswordConfirmation ||
      regenerateRecoveryCodes.requiresPasswordConfirmation
    );
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <A href="/">Home</A>
            </li>
            <li>
              <A href="/user-settings">User Settings</A>
            </li>
          </ul>
        </nav>
        <LogoutButton />
      </header>
      <div>{props.children}</div>
      <Show when={twoFactorRequiresPassword()}>
        <ConfirmPasswordModal />
      </Show>
    </>
  );
};

export default MainLayout;
