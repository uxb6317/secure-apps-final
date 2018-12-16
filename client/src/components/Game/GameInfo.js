import React from "react";

const GameInfo = props => {
  return (
    <svg>
      <text x="76%" y="5%" className="game-info">
        Game Info
      </text>
      <circle cx="84%" cy="9.1%" r="5" fill="#f1c40f" />
      <text x="85.5%" y="10%">
        {props.player1}
      </text>
      <circle cx="84%" cy="14.1%" r="5" fill="#e74c3c" />
      <text x="85.5%" y="15%">
        {props.player2}
      </text>
      <text x="76%" y="10%" fill="#CF000F">
        Turn &rarr;
      </text>
    </svg>
  );
};

export default GameInfo;
