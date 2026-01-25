import { AuthService } from "../../../Services/AuthService";
import { useApi } from "./ApiProvider";
import LogoutButton from "./LogoutButton";

const Home = () => {
  AuthService(useApi()).testAuthenticatedRoute().then(console.log);

  return (
    <>
      <header>
        <LogoutButton />
      </header>
      <h1>Home</h1>
    </>
  );
};

export default Home;
