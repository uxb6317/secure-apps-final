import React from "react";
import { Link } from "react-router-dom";

import NavItems from "./NavItems";
import ChallengeModal from "./ChallengeModal";

import "./header.css";

const Header = props => {
  return (
    <header>
      <Link to="/" className="logo">
        Connect 4
      </Link>
      <div className="right-menu">
        <NavItems
          challenger={props.challenger}
          isAuth={props.isAuth}
          onLogout={props.onLogout}
          onLogin={props.onLogin}
          name={props.name}
        />
      </div>
      {props.challenger && (
        <ChallengeModal
          denyChallenge={props.denyChallenge}
          acceptChallenge={props.acceptChallenge}
          {...props.challenger}
        />
      )}
    </header>
  );
};

export default Header;
