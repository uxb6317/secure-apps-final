import React from "react";

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.loginHandler(this.state.email, this.state.password);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="email"
          name="email"
          id="email"
          value={this.state.email}
          placeholder="Email"
          onChange={this.handleEmailChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          value={this.state.password}
          placeholder="Password"
          onChange={this.handlePasswordChange}
        />
        <button type="submit">Login</button>
      </form>
    );
  }
}

export default Login;
