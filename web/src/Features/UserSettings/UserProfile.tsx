import { useRxApp } from "../../Shared/Components/RxAppProvider";
import { Show } from "solid-js";

const UserProfile = () => {
  const [{ select }] = useRxApp();

  return (
    <Show when={select.getUser()}>
      {(u) => (
        <div>
          <h2>User Profile</h2>
          <div>
            <b>Name:</b> {u().name}
          </div>
          <div>
            <b>Email:</b> {u().email}
          </div>
        </div>
      )}
    </Show>
  );
};

export default UserProfile;
