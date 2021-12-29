import React from "react"
import { backend, urlEncode } from "./util";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
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
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: JSON.stringify(this.state)
    }).then(response => response.json())
      .then(this.props.onResponse);

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">Username:</label><br />
        <input id="username" name="username" value={this.state.username} onChange={this.handleChange} /><br />
        <label htmlFor="password">Password:</label><br />
        <input type="password" id="password" name="password" value={this.state.password} onChange={this.handleChange} /><br />
        {this.props.children}
      </form>
    );
  }
}

function handleLogin(json) {
  console.log("Login response");
  console.log(json);
}

function LoginForm() {
  return (
    <Form url={backend("login")} onResponse={handleLogin}>
      <a>Sign up instead</a>
      <input type="submit" value="Login" />
    </Form>
  )
}

function handleSignup(json) {
  console.log("Signup response");
  console.log(json);
}

function SignupForm() {
  return (
    <Form url={backend("register")} onResponse={handleSignup}>
      <a>Login instead</a>
      <input type="submit" value="Sign up" />
    </Form>
  )
}

export { LoginForm, SignupForm };
