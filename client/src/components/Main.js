import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Games from "./Game/Games";
import Game from "./Game/Game";
import Chat from "./Chat/ChatComponents/Chat";
import Spectators from "./Game/Spectators";
import ActiveUsers from "./Chat/UserComponents/ActiveUsers";

class Main extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => (
            <div className="container">
              <ActiveUsers
                isAuth={this.props.isAuth}
                token={this.props.token}
                socket={this.props.socket}
                userId={this.props.userId}
                challengeHandler={this.props.challengeHandler}
                cancelHandler={this.props.cancelHandler}
                challenged={this.props.challenged}
              />
              <Chat
                chatType="global-chat"
                token={this.props.token}
                socket={this.props.socket}
              />
            </div>
          )}
        />
        <Route
          path="/login"
          exact
          render={props => (
            <Login {...props} loginHandler={this.props.onLogin} />
          )}
        />
        <Route
          path="/signup"
          exact
          render={props => (
            <Signup {...props} signupHandler={this.props.onSignup} />
          )}
        />
        <Route
          path="/game"
          exact
          render={props => (
            <div className="container">
              <Spectators />
              <Game
                {...props}
                socket={this.props.socket}
                userId={this.props.userId}
                r="6"
                c="7"
                player1="Bob"
                player2="Jax"
              />
              <Chat
                chatType="game-chat"
                token={this.props.token}
                socket={this.props.socket}
              />
            </div>
          )}
        />
        <Route path="/games" exact component={Games} />
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default Main;
