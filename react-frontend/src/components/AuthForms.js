import React, { useContext, useEffect } from "react"
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "../css/AuthForms.css";
import Page from "./StandardPage";

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
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state);
    event.preventDefault();
  }

  render() {
    return (
      <AuthContext.Consumer>
        {auth => {
          if (auth.loggedIn)
            return <Navigate to="/user/me" replace />

          return (
            <form className="auth-form" onSubmit={this.handleSubmit}>
              <label>
                Username:
                <input id="username" value={this.state.username} onChange={this.handleChange} />
              </label>
              <label>
                Password:
                <input type="password" value={this.state.password} id="password" onChange={this.handleChange} />
              </label>
              <div className="form-children">{this.props.children}</div>
            </form>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

function LoginForm() {
  const auth = useContext(AuthContext);

  return (
    <Page title="Login">
      <Form onSubmit={auth.login}>
        <Link to="/signup">Sign up instead</Link>
        <input type="submit" value="Login" />
      </Form>
    </Page>
  );
}

function SignupForm() {
  const auth = useContext(AuthContext);

  return (
    <Page title="Sign up">
      <Form onSubmit={auth.register}>
        <Link to="/login">Log in instead</Link>
        <input type="submit" value="Sign up" />
      </Form>
    </Page>
  )
}

export { LoginForm, SignupForm };
