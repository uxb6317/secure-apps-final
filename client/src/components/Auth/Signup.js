import React from "react";

class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  };

  nameChangeHandler = e => {
    this.setState({ name: e.target.value });
  };

  emailChangeHandler = e => {
    this.setState({ email: e.target.value });
  };

  passwordChangeHandler = e => {
    this.setState({ password: e.target.value });
  };

  passwordConfirmChangeHandler = e => {
    this.setState({ passwordConfirm: e.target.value });
  };

  submitHandler = e => {
    e.preventDefault();
    this.props.signupHandler(
      this.state.name,
      this.state.email,
      this.state.password,
      this.state.passwordConfirm
    );
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <input
            type="text"
            name="name"
            id="name"
            value={this.state.name}
            onChange={this.nameChangeHandler}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            id="email"
            value={this.state.email}
            onChange={this.emailChangeHandler}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            id="password"
            value={this.state.password}
            onChange={this.passwordChangeHandler}
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={this.state.passwordConfirm}
            onChange={this.passwordConfirmChangeHandler}
            placeholder="Confirm Password"
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    );
  }
}

export default Signup;
