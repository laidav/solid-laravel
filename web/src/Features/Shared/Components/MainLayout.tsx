import { A, type RouteSectionProps } from "@solidjs/router";
import { AuthService } from "../../../Services/AuthService";
import { useApi } from "./ApiProvider";
import LogoutButton from "./LogoutButton";

const MainLayout = (props: RouteSectionProps) => {
  AuthService(useApi()).testAuthenticatedRoute().then(console.log);

  return (
    <>
      <header>
        <div>Main Nav</div>
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
    </>
  );
};

export default MainLayout;
