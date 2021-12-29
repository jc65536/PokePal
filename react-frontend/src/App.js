import "./App.css";
import { LoginForm, SignupForm } from "./Form";
import { backend } from "./util"

function getUser() {
  fetch(backend("user"), { credentials: "include"}).then(response => response.json())
    .then(console.log);
}

function App() {
  return (
    <div className="App">
      <LoginForm />
      <SignupForm />
      <button onClick={getUser}>Get user</button>
    </div>
  );
}

export default App;
