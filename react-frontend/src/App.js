import "./css/App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { LoginForm, SignupForm } from "./components/AuthForms"
import Search from "./pages/Search"
import Pokemon from "./pages/Pokemon";

import { AuthContext, AuthContextProvider } from "./AuthContext";
import LogoutButton from "./components/LogoutButton";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <nav>
          <Link to="/" id="logo">PokePal</Link>
          <ul>
            <li><Link to="/search">Find a PokePal</Link></li>
            <AuthContext.Consumer>
              {auth => {
                if (auth.loggedIn) {
                  return <>
                    <li><Link to="/user/me">Me</Link></li>
                    <li><LogoutButton /></li>
                  </>;
                } else {
                  return <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign up</Link></li>
                  </>;
                }
              }}
            </AuthContext.Consumer>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/me" element={<Profile />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pokemon/:name" element={<Pokemon />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
