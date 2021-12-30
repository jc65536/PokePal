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
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    fetch(this.props.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": this.state.username,
        "password": this.state.password
      })
    }).then(this.setState({ submitted: true }));

    event.preventDefault();
  }

  render() {
    if (this.state.submitted)
      return <Navigate to="/user/me" />

    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">Username:</label><br />
        <input name="username" value={this.state.username} onChange={this.handleChange} /><br />
        <label htmlFor="password">Password:</label><br />
        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} /><br />
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
