import "./App.css";
import { Route, Router } from "@solidjs/router";

function App() {
  return (
    <div>
      <Router>
        <Route path="/" component={() => <h1>Home</h1>} />
        <Route path="/register" component={() => <h1>Register</h1>} />
      </Router>
    </div>
  );
}

export default App;
