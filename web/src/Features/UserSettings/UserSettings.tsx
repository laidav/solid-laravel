import { A, type RouteSectionProps } from "@solidjs/router";
const UserSettings = (props: RouteSectionProps) => {
  return (
    <div>
      <h1>User Settings</h1>
      <nav>
        <ul>
          <li>
            <A href="/user-settings">User Profile</A>
          </li>
          <li>
            <A href="/user-settings/two-factor-authentication">
              Two factor authentication
            </A>
          </li>
        </ul>
      </nav>
      <div>{props.children}</div>
    </div>
  );
};

export default UserSettings;
