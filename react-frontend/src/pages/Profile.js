import React from "react";
import { Navigate } from "react-router-dom";

import { backend } from "../util";

function logout() {
  fetch(backend("logout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: null,
      username: "",
      favorite_pkmn: 0
    }
  }

  componentDidMount() {
    fetch(backend("user"), { credentials: "include" }).then(res => {
      if (res.status < 400)
        this.setState({ authorized: true });
      else
        this.setState({ authorized: false });
      return res.json();
    }).then(console.log);
  }

  render() {
    if (this.state.authorized == null)
      return null

    if (!this.state.authorized)
      return <Navigate to="/login" replace />

    return (
      <div>
        Hello, user!<br/>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
}

export default Profile;
