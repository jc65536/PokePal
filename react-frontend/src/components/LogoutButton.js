import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function LogoutButton() {
  const auth = useContext(AuthContext);

  function handleClick(event) {
    event.preventDefault();
    auth.logout();
  }

  return <a href="#" onClick={handleClick}>Logout</a>
}

export default LogoutButton;
