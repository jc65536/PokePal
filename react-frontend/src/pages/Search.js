import React from "react"
import { Link } from "react-router-dom";

import { backend } from "../util";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
    
  }

  render() {
    if (this.state.submitted)
      return <Navigate to="/user/me" />

    return (
      <form>
        <label htmlFor="query">Search</label><br />
        <input name="query" value={this.state.query} onChange={this.handleChange} /><br />
      </form>
    );
  }
}
