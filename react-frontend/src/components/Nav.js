import { useContext } from "react"
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext"

import LogoutButton from "./LogoutButton";

function Nav() {
  const auth = useContext(AuthContext);
  return (
    <nav>
      <Link to="/" id="logo">PokePal</Link>
      <ul>
        <li><Link to="/search">Find a PokePal</Link></li>
        {auth.loggedIn ? <>
          <li><Link to="/user/me">Me</Link></li>
          <li><LogoutButton /></li>
        </> : <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign up</Link></li>
        </>}
      </ul>
    </nav>
  );
}

export default Nav;
