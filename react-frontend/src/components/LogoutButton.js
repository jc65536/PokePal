import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { backend } from "../util"

function LogoutButton() {
  const auth = useContext(AuthContext);

  function handleClick(event) {
    event.preventDefault();
    auth.logout();
  }

  return <a href="#" onClick={handleClick}>Logout</a>
}

export default LogoutButton;
