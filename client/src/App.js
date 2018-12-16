import React from "react";
import { withRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";

import Header from "./components/Header/Header";
import Main from "./components/Main";
import server from "./server";

// socket connection to pass around my app
const socket = socketIOClient("http://localhost:8080", {
  transports: ["websocket", "polling", "flashsocket"]
});

class App extends React.Component {
  state = {
    isAuth: false,
    token: null,
    userId: null,
    name: "Guest",
    challenger: null
  };

  componentWillMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    if (localStorage.getItem("challenger")) {
      this.setState({
        challenger: JSON.parse(localStorage.getItem("challenger"))
      });
    }

    this.setState({
      isAuth: true,
      token: token,
      userId: localStorage.getItem("userId"),
      name: localStorage.getItem("name")
    });
  }

  // grab the user's token from localstorage and store it in
  // my state
  componentDidMount() {
    socket.on("new challenger", challenger => {
      if (challenger.challengedUserId === this.state.userId) {
        localStorage.setItem(
          "challenger",
          JSON.stringify({
            name: challenger.name,
            userId: challenger.userId
          })
        );
        this.setState({
          challenger: {
            name: challenger.name,
            userId: challenger.userId
          }
        });
        console.log(`you have been challenged by: ${challenger.name}`);
      }
    });

    socket.on("challenge accepted", data => {
      // change the view for the user who issued a challenged and that challenge was accepted
      if (data.challengerId === this.state.userId) {
        this.props.history.push("/game");
      }
    });
  }

  // in the backend, when this request is made
  // the server will emit an event to update the
  // online users
  logoutHandler = () => {
    server
      .get("auth/logout", {
        headers: { Authorization: "Bearer " + this.state.token }
      })
      .then(res => {
        this.setState({
          isAuth: false,
          token: null,
          userId: null,
          name: "Guest",
          challenger: null
        });
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.removeItem("challenger");
      })
      .catch(err => console.log(err));
  };

  // server will emit an event to update the list of
  // online users after successful login
  loginHandler = (email, password) => {
    server
      .post("auth/login", {
        email,
        password
      })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("name", res.data.name);

        if (res.data.challenger !== null) {
          localStorage.setItem(
            "challenger",
            JSON.stringify({
              name: res.data.challenger.name,
              userId: res.data.challenger.userId
            })
          );
          this.setState({
            challenger: {
              name: res.data.challenger.name,
              userId: res.data.challenger.userId
            }
          });
        }

        this.setState(
          {
            isAuth: true,
            token: res.data.token,
            userId: res.data.userId,
            name: res.data.name
          },
          () => {
            this.props.history.push("/");
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  signupHandler = (name, email, password, passwordConfirm) => {
    server
      .put("auth/signup", {
        name,
        email,
        password,
        passwordConfirm
      })
      .then(res => {
        this.setState({ isAuth: false }, () => {
          this.props.history.push("/");
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  denyChallenge = () => {
    server
      .post(
        "user/challenge/deny",
        {
          deniedId: this.state.challenger.userId
        },
        {
          headers: { Authorization: "Bearer " + this.state.token }
        }
      )
      .then(res => {
        this.setState({ challenger: null });
        localStorage.removeItem("challenger");
      })
      .catch(err => console.log(err));
  };

  acceptChallenge = () => {
    server
      .post(
        "user/challenge/accept",
        {
          challengerId: this.state.challenger.userId
        },
        {
          headers: {
            Authorization: "Bearer " + this.state.token
          }
        }
      )
      .then(res => {
        // console.log(res.data.msg);
        this.props.history.push("/game");
        // this.setState({ challenger: null });
        // localStorage.removeItem("challenger");
        // this.props.history.push("/game");
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <Header
          isAuth={this.state.isAuth}
          token={this.state.token}
          onLogout={this.logoutHandler}
          name={this.state.name}
          userId={this.state.userId}
          challenger={this.state.challenger}
          denyChallenge={this.denyChallenge}
          acceptChallenge={this.acceptChallenge}
          socket={socket}
        />
        <Main
          isAuth={this.state.isAuth}
          onLogin={this.loginHandler}
          onSignup={this.signupHandler}
          token={this.state.token}
          userId={this.state.userId}
          challengeHandler={this.challengeHandler}
          cancelHandler={this.cancelHandler}
          socket={socket}
        />
      </div>
    );
  }
}

export default withRouter(App);
