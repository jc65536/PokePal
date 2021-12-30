import React from "react"
import { Link, Navigate } from "react-router-dom";

import { backend } from "../util";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
  }

  handleSubmit(event) {
    fetch(this.props.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        "username": this.state.username,
        "password": this.state.password
      })
    }).then(() => this.setState({ submitted: true }));
    event.preventDefault();
  }

  render() {
    if (this.state.submitted)
      return <Navigate to="/user/me" />

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input id="username" value={this.state.username} onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="password" value={this.state.password} id="password" onChange={this.handleChange} />
        </label>
        {this.props.children}
      </form>
    );
  }
}

function LoginForm() {
  return (
    <Form url={backend("login")}>
      <Link to="/signup">Sign up instead</Link>
      <input type="submit" value="Login" />
    </Form>
  );
}

function SignupForm() {
  return (
    <Form url={backend("register")}>
      <Link to="/login">Log in instead</Link>
      <input type="submit" value="Sign up" />
    </Form>
  )
}

export { LoginForm, SignupForm };
