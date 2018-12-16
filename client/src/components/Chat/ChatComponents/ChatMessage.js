import React from "react";
import moment from "moment";

const ChatMessage = props => {
  return (
    <div className="chat-message">
      <p className="time">{moment(props.time).format("hh:mm:ss A")}</p>
      <p className="sender">{props.sender}</p>
      <p className="content">{props.content}</p>
    </div>
  );
};

export default ChatMessage;
