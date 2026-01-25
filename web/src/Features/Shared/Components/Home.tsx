import { type JSX } from "solid-js";
import { A } from "@solidjs/router";
import { AuthService } from "../../../Services/AuthService";
import { useApi } from "./ApiProvider";
import LogoutButton from "./LogoutButton";

const Home = (props: { children: JSX.Element }) => {
  AuthService(useApi()).testAuthenticatedRoute().then(console.log);

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
      <h1>Home</h1>
      <div>{props.children}</div>
    </>
  );
};

export default Home;
