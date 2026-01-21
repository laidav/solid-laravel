import { AuthService } from "../../../Services/authService";
import { useApi } from "./ApiProvider";

const Home = () => {
  const authService = AuthService(useApi());

  authService.test().then(console.log);
  return <h1>Home</h1>;
};

export default Home;
