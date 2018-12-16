import React from "react";

import ChatMessage from "./ChatMessage";

class ChatWindow extends React.Component {
  render() {
    return (
      <div className="chat-window">
        {this.props.messages.map(message => {
          return (
            <ChatMessage
              time={message.time}
              sender={message.sender}
              content={message.content}
              key={message.id}
            />
          );
        })}
      </div>
    );
  }
}

export default ChatWindow;
