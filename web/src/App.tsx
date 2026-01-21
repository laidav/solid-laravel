import "./App.css";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import ApiProvider from "./Features/Shared/Components/ApiProvider";
import Home from "./Features/Shared/Components/Home";

function App() {
  return (
    <ApiProvider>
      <div>
        <Router>
          <Route path="/" component={() => <h1>Starter App</h1>} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/home" component={Home} />
        </Router>
      </div>
    </ApiProvider>
  );
}

export default App;
