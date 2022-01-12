import "./css/App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Nav from "./components/Nav"
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { LoginForm, SignupForm } from "./components/AuthForms"
import Search from "./pages/Search"
import Pokemon from "./pages/Pokemon";

import { AuthContext } from "./AuthContext";
import { useContext, useEffect } from "react";

function App() {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // Check session on location change (which simulates a page load)
  useEffect(auth.checkSession, [location]);

  return <>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user/me" element={<Profile />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/search" element={<Search />} />
      <Route path="/pokemon/:name" element={<Pokemon />} />
    </Routes>
  </>;
}

export default App;
