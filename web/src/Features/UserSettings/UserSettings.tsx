import { A, type RouteSectionProps } from "@solidjs/router";
const UserSettings = (props: RouteSectionProps) => {
  return (
    <div>
      <h1>UserSettings</h1>
      <nav>
        <A href="/user-settings">General Settings</A>
        <A href="/user-settings/two-factor-authentication">
          Two factor authentication
        </A>
      </nav>
      <div>{props.children}</div>
    </div>
  );
};

export default UserSettings;
