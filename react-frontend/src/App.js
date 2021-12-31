import "./css/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import Nav from "./components/Nav"
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { LoginForm, SignupForm } from "./components/AuthForms"
import Search from "./pages/Search"
import Pokemon from "./pages/Pokemon";

import { AuthContext, AuthContextProvider } from "./AuthContext";
import LogoutButton from "./components/LogoutButton";
import { useContext, useEffect } from "react";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Nav />
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
