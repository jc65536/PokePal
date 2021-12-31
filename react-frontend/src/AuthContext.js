import React, { createContext } from "react";

import { backend } from "./util";

const AuthContext = createContext({
  loggedIn: false,
  login: () => { },
  logout: () => { },
  register: () => { }
});

class AuthContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.postLoginForm = this.postAuthForm.bind(this);

    this.state = {
      loggedIn: localStorage.getItem("loggedIn") == "true",
      login: this.login,
      logout: this.logout,
      register: this.register
    }
  }

  componentDidMount() {
    fetch(backend("check-session"), {
      method: "POST",
      credentials: "include"
    }).then(res => res.json())
      .then(json => this.setState({ loggedIn: json["logged-in"] }));
  }

  componentDidUpdate() {
    console.log("AuthContext update!");
    localStorage.setItem("loggedIn", this.state.loggedIn);
  }

  logout() {
    fetch(backend("logout"), {
      method: "POST",
      credentials: "include"
    }).then(() => this.setState({ loggedIn: false }));
  }

  postAuthForm(url, formData) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData)
    }).then(res => {
      if (res.status < 400)
        this.setState({ loggedIn: true });
      else
        this.setState({ loggedIn: false });
    });
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
