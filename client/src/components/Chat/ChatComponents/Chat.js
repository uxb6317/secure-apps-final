import React from "react";

import ChatWindow from "./ChatWindow";
import ChatForm from "./ChatForm";

import "./chat.css";
import server from "../../../server";

class Chat extends React.Component {
  state = {
    chatId: "",
    messages: []
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    // load chat history
    console.log(this.props.chatType);
    if (this.props.chatType === "global-chat") {
      this.loadGlobalChat();
    } else if (this.props.chatType === "game-chat") {
      this.loadChat();
    }
    this.props.socket.on("new message", data => {
      this.addMessage(data.responseData);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadChat = () => {
    server
      .get()
      .get("chat/" + this.state.chatId)
      .then(res => {
        this.setState({ chatId: res.data.chatId });
        this.setState({ messages: res.data.messages });
      })
      .catch(err => console.log(err));
  };

  loadGlobalChat = () => {
    server
      .get("chat/global")
      .then(res => {
        this.setState({ chatId: res.data.chatId });
        this.setState({ messages: res.data.messages });
      })
      .catch(err => console.log(err));
  };

  newMessage = message => {
    server
      .post(
        "chat/postMessage",
        {
          message,
          chatId: this.state.chatId
        },
        {
          headers: {
            Authorization: "Bearer " + this.props.token
          }
        }
      )
      .then(res => {
        console.log();
      })
      .catch(err => console.log(err));
  };

  addMessage = message => {
    if (this._isMounted) {
      if (this.state.chatId === message.chatId) {
        this.setState(prevState => ({
          messages: [...prevState.messages, message]
        }));
      }
    }
  };

  render() {
    return (
      <div className={`sub-container ${this.props.chatType}`}>
        <p className="title">Chat</p>
        <div className="chat">
          <ChatWindow messages={this.state.messages} />
          <ChatForm messageHandler={this.newMessage} />
        </div>
      </div>
    );
  }
}

export default Chat;
