/*
AuthContext provides an interface for handling user authentication.
Its state is used by other components to determine whether the user is
authenticated.

AuthContextProvider holds a loggedIn state
Whenever loggedIn changes state, relevant components (nav bar, protected
content, buttons that make protected requests) are re-rendered.

The purpose of this is to ensure that:
- Correct info is displayed based on user authentication (e.g. login/signup in
  the nav bar if the user is not logged in, me/logout if the user is logged in)
- Handling an unauthenticated state can be centralized instead of dealing with
  individual 4xx response codes to various unauthenticated requests.

loggedIn changes state when:
- Successful response to a login request is received
- Successful response to a register request is received
- The user requests to logout

loggedIn should change when the session expires, but we don't have a timer.
Instead, we rely on th backend to tell us when our session expires.

When the backend endpoint check-session is requested, the user session (if
authenticated) is refreshed, and the user's authentication stat is returned.
The corresponding interface in the client is called checkSession.

checkSession should be called for every client "request":
- Getting page content (these are simulated requests)
- Getting user data
- Setting user data
These "requests" should be user-driven. E.g. Profile gets user data on component
mount, and since checkSession is already called on page load by App, it is
unnecessary to call it again.
*/

import React, { createContext } from "react";

import { backend } from "./util";

const AuthContext = createContext({
  loggedIn: false,
  // Interface for user login
  login: () => { },
  // Interface for user logout
  logout: () => { },
  // Interface for user registration
  register: () => { },
  /**
   * Interface for checking if user is authenticated
   * If the user is authenticated, the user session is refreshed.
   */
  checkSession: async () => { }
});

class AuthContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.postLoginForm = this.postAuthForm.bind(this);
    this.checkSession = this.checkSession.bind(this);

    this.state = {
      checkSession: this.checkSession,
      login: this.login,
      logout: this.logout,
      register: this.register,
      loggedIn: localStorage.getItem("loggedIn") == "true", // Do not read directly; use checkSession() instead
    }
  }

  componentDidUpdate() {
    localStorage.setItem("loggedIn", this.state.loggedIn);
  }

  async checkSession() {
    // A false loggedIn state is guaranteed to be accurate, since the server
    // couldn't have logged us in automatically
    if (!this.state.loggedIn)
      return false;

    // Refresh session. Ultimately, the backend decides whether we're logged in.
    const res = await fetch(backend("check-session"), { credentials: "include" });
    const json = await res.json();
    const loggedIn = json["logged-in"];
    if (!loggedIn)
      this.setState({ loggedIn: false });
    return loggedIn;
  }

  logout() {
    fetch(backend("logout"), {
      method: "POST",
      credentials: "include"
    });
    this.setState({ loggedIn: false });
  }

  async postAuthForm(url, formData) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData)
    });
    if (res.status < 400)
      this.setState({ loggedIn: true });
    else
      this.setState({ loggedIn: false });
  }

  login(formData) {
    this.postAuthForm(backend("login"), formData);
  }

  register(formData) {
    this.postAuthForm(backend("register"), formData);
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export { AuthContextProvider, AuthContext };
