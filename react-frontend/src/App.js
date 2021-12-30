import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { LoginForm, SignupForm } from "./components/AuthForms"
import Search from "./pages/Search"
import Pokemon from "./pages/Pokemon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/me" element={<Profile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/search" element={<Search />} />
        <Route path="/pokemon/:name" element={<Pokemon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
