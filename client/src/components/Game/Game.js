import React from "react";

import Column from "./Column";
import Mask from "./Mask";
import GameInfo from "./GameInfo";

import server from "../../server";

import "./game.css";

class Game extends React.Component {
  state = {
    board: [],
    player: 1
  };

  componentDidMount = () => {
    console.log(this.props.userId);
    server
      .post("game/getGame", {
        userId: this.props.userId
      })
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  componentWillMount() {
    this.newBoard();
  }

  newBoard = () => {
    let board = [];
    for (let r = 0; r < this.props.r; r++) {
      let row = [];
      for (let c = 0; c < this.props.c; c++) {
        row.push(0);
      }
      board.push(row);
    }
    this.setState({ board });
  };

  switchPlayer = () => {
    if (this.state.player === 1) {
      this.setState({ player: 2 });
    } else {
      this.setState({ player: 1 });
    }
  };

  dropDisc = (player, x, y) => {
    const board = this.state.board;
    board[y][x] = player;
    this.setState({ board });
    this.switchPlayer();
  };

  render() {
    let columns = [];
    for (let index = 0; index < this.props.c; index++) {
      columns.push(
        <Column
          key={index}
          r={this.props.r}
          dropDiscHandler={this.dropDisc}
          x={index * 100}
          column={index}
          player={this.state.player}
        />
      );
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="100%"
        className="game-container"
      >
        <svg
          className="game"
          viewBox="0 0 700 600"
          width="75%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <Mask />
          {columns}
        </svg>
        <GameInfo player1={this.props.player1} player2={this.props.player2} />
      </svg>
    );
  }
}

export default Game;
