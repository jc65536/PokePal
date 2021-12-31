/**
 * AuthContext provides an interface for handling user authentication.
 * Its state is used by other components to determine whether the user is
 * authenticated.
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
   * Session should be refreshed any time user data is gotten or set.
   * (Since the nav bar is always present, this would include all page loads)
   */
  checkSession: () => { }
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

  checkSession() {
    // A false loggedIn state is guaranteed to be accurate, since the server
    // couldn't have logged us in automatically
    if (!this.state.loggedIn)
      return false;

    // Refresh session. Ultimately, the backend decides whether we're logged in.
    fetch(backend("check-session"), { credentials: "include" })
      .then(res => res.json())
      .then(json => {
        if (!json["logged-in"]) {
          this.setState({ loggedIn: false });
        }
      });

    return true;
  }

  logout() {
    fetch(backend("logout"), {
      method: "POST",
      credentials: "include"
    }).then(() => this.setState({ loggedIn: false }));
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
