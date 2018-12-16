import React from "react";

import GamePreview from "./GamePreview";

class Games extends React.Component {
  render() {
    return (
      <div>
        <GamePreview />
        <GamePreview />
      </div>
    );
  }
}

export default Games;
