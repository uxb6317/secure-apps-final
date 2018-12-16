import React from "react";
import { NavLink } from "react-router-dom";

class NavItems extends React.Component {
  render() {
    let navLinks = [];

    navLinks.push(
      <NavLink
        className="nav-item"
        exact
        key="chat"
        to="/"
        activeClassName="active"
      >
        Chat
      </NavLink>
    );

    navLinks.push(
      <NavLink
        className="nav-item"
        exact
        key="games"
        to="/games"
        activeClassName="active"
      >
        Games
      </NavLink>
    );

    if (this.props.isAuth) {
      navLinks.push(
        <button className="nav-item" key="logout" onClick={this.props.onLogout}>
          Logout
        </button>
      );
    } else {
      navLinks.push(
        <NavLink
          className="nav-item"
          exact
          key="login"
          to="/login"
          activeClassName="active"
        >
          Login
        </NavLink>
      );
      navLinks.push(
        <NavLink
          className="nav-item"
          exact
          key="signup"
          to="/signup"
          activeClassName="active"
        >
          Signup
        </NavLink>
      );
    }

    // const challengePrompHandler = () => {

    // }

    // display name if logged in
    this.props.isAuth &&
      navLinks.push(
        <button className="nav-item username-btn" key="name">
          {this.props.name}
          {this.props.challenger && (
            <span className="challenge">Game Requested!</span>
          )}
        </button>
      );

    return navLinks;
  }
}

export default NavItems;
