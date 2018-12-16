import React from "react";

class ChatForm extends React.Component {
  state = {
    message: ""
  };

  messageChangeHandler = e => {
    this.setState({ message: e.target.value });
  };

  submitHandler = e => {
    e.preventDefault();
    this.props.messageHandler(this.state.message);
    this.setState({ message: "" });
  };

  enterKeyHandler = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.props.messageHandler(this.state.message);
      this.setState({ message: "" });
    }
  };

  render() {
    return (
      <form className="chat-form" onSubmit={this.submitHandler}>
        <textarea
          name="message"
          id="message"
          rows="2"
          onChange={this.messageChangeHandler}
          value={this.state.message}
          onKeyDown={this.enterKeyHandler}
        />
        <button type="submit">Send</button>
      </form>
    );
  }
}

export default ChatForm;
