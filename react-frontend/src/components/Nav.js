import { useContext, useEffect } from "react"
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext"

import LogoutButton from "./LogoutButton";

function Nav() {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // Check session on location change (which simulates a page load)
  useEffect(() => auth.checkSession(), [location]);

  return (
    <nav>
      <Link to="/" id="logo">PokePal</Link>
      <ul>
        <li><Link to="/search">Find a PokePal</Link></li>
        {auth.checkSession() ?
          <>
            <li><Link to="/user/me">Me</Link></li>
            <li><LogoutButton /></li>
          </> :
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
          </>}
      </ul>
    </nav>
  );
}

export default Nav;
