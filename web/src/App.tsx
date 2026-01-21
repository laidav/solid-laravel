import "./App.css";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import ApiProvider from "./Features/Shared/Components/ApiProvider";
import { useApi } from "./Features/Shared/Components/ApiProvider";
import { AuthService } from "./Services/authService";

const Home = () => {
  const authService = AuthService(useApi());

  authService.test().then(console.log);
  return <h1>Home</h1>;
};

function App() {
  return (
    <ApiProvider>
      <div>
        <Router>
          <Route path="/" component={() => <h1>Welcome!</h1>} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/home" component={Home} />
        </Router>
      </div>
    </ApiProvider>
  );
}

export default App;
