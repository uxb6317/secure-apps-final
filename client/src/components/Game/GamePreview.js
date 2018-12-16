import React from "react";

import "./game.css";

class GamePreview extends React.Component {
  state = {
    gameId: null,
    playerOneId: null,
    playerTwoId: null
  };

  render() {
    return <div className="game-preview" />;
  }
}

export default GamePreview;
