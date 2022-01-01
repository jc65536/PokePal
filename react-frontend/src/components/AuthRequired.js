import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function AuthRequired({ children }) {
  const auth = useContext(AuthContext);
  if (!auth.loggedIn)
    return < Navigate to="/login" replace />;

  return <>{children}</>;
}

export default AuthRequired;
