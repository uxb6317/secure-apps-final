import React from "react";

import SingleActiveUser from "./SingleActiveUser";

import "./activeusers.css";
import server from "../../../server";

class ActiveUsers extends React.Component {
  state = {
    users: [],
    challenged: []
  };

  componentDidMount() {
    this.loadUsers(); // get logged in users
    this.props.socket.on("add user", data => this.addUser(data));
    this.props.socket.on("remove user", data => this.removeUser(data));
    this.props.socket.on("challenge denied", data => {
      this.loadUsers();
    });
  }

  challengeHandler = challengerId => {
    server
      .get("user/challenge/" + challengerId, {
        headers: { Authorization: "Bearer " + this.props.token }
      })
      .then(res => {
        this.setState({ challenged: res.data.challenged });
      })
      .catch(err => console.log(err));
  };

  cancelHandler = challengerId => {
    console.log("cancel");
  };

  loadUsers = () => {
    server
      .get("user/active_users")
      .then(res => {
        let challengedUsers = [];

        res.data.users.forEach(user => {
          if (user.challenger === this.props.userId) {
            challengedUsers.push({ _id: user._id });
          }
        });

        this.setState({ challenged: challengedUsers });
        this.setState({ users: res.data.users });
      })
      .catch(err => console.log(err));
  };

  addUser = user => {
    this.setState({
      users: [...this.state.users, { _id: user.userId, name: user.name }]
    });
  };

  removeUser = userToRemove => {
    const users = [...this.state.users];
    users.forEach((user, i) => {
      if (user._id === userToRemove.userId) {
        users.splice(i, 1);
        this.setState({ users });
        return;
      }
    });
  };

  render() {
    return (
      <div className="sub-container active-users">
        <p className="title">Online Users</p>
        <ul>
          {this.state.users.map(user => {
            if (user._id === this.props.userId) {
              return <SingleActiveUser username={user.name} key={user._id} />;
            }

            {
              /* const isChallenged = this.state.challenged.find(challengedUser => {
              console.log("Already challenged");
              return challengedUser._id === user._id;
            }); */
            }

            const isChallenged = false;

            return (
              <SingleActiveUser
                isAuth={this.props.isAuth}
                action={
                  isChallenged ? this.cancelHandler : this.challengeHandler
                }
                actionText={isChallenged ? "Cancel" : "Challenge"}
                actionClass={
                  isChallenged ? "cancel-challenge" : "send-challenge"
                }
                username={user.name}
                userId={user._id}
                key={user._id}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default ActiveUsers;
