import { Show } from "solid-js";
import { A, type RouteSectionProps } from "@solidjs/router";
import { AuthService } from "../../Services/AuthService";
import { useApi } from "./ApiProvider";
import LogoutButton from "./LogoutButton";
import ConfirmPasswordModal from "./ConfirmPasswordModal";
import { useRxApp } from "./RxAppProvider";

const MainLayout = (props: RouteSectionProps) => {
  AuthService(useApi()).testAuthenticatedRoute().then(console.log);
  const [{ select }] = useRxApp();

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
      <Show when={select.twoFactorRequiresPassword()}>
        <ConfirmPasswordModal />
      </Show>
    </>
  );
};

export default MainLayout;
