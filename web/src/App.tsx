import "./App.css";
import { Route, Router } from "@solidjs/router";
import SignUp from "./Features/Auth/SignUp";

function App() {
  return (
    <div>
      <Router>
        <Route path="/" component={() => <h1>Home</h1>} />
        <Route path="/sign-up" component={SignUp} />
      </Router>
    </div>
  );
}

export default App;
