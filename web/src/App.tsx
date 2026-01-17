import "./App.css";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";
import ApiProvider from "./Features/Shared/Components/ApiProvider";

function App() {
  return (
    <ApiProvider>
      <div>
        <Router>
          <Route path="/" component={() => <h1>Home</h1>} />
          <Route path="/sign-up" component={SignUp} />
        </Router>
      </div>
    </ApiProvider>
  );
}

export default App;
