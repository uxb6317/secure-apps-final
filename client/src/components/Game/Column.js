import React from "react";
import Disc from "./Disc";
import { TweenMax } from "gsap/all";

class Column extends React.Component {
  state = {
    spaces: []
  };

  componentWillMount() {
    this.initColumn();
  }

  initColumn = () => {
    let spaces = [];
    for (let r = 0; r < this.props.r; r++) {
      spaces.push(0);
    }
    this.setState({ spaces });
  };

  getEmptySpace = () => {
    for (let y = this.state.spaces.length; y >= 0; y--) {
      if (this.state.spaces[y] === 0) {
        return y;
      }
    }
    return -1;
  };

  dropPiece = () => {
    const emptySpace = this.getEmptySpace();
    if (emptySpace !== -1) {
      this.props.dropDiscHandler(
        this.props.player,
        this.props.column,
        emptySpace
      );
      const spaces = [...this.state.spaces];
      spaces[emptySpace] = this.props.player;
      this.setState({ spaces });
    }
  };

  handleMouseEnter = () => {
    TweenMax.to(this.columnRef, 0.25, { fill: "#2980b9" });
  };

  handleMouseLeave = () => {
    TweenMax.to(this.columnRef, 0.25, { fill: "#3498db" });
  };

  render() {
    const discs = [];
    this.state.spaces.forEach((space, i) => {
      if (space > 0) {
        discs.push(
          <Disc
            key={i}
            cx="50"
            cy={i * 100 + 50}
            r="45"
            player={this.props.player}
          />
        );
      }
    });
    return (
      <svg x={this.props.x} y="0">
        {discs}
        <rect
          ref={ref => (this.columnRef = ref)}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.dropPiece}
          className="column"
          width="100"
          height="600"
          fill="#3498db"
          mask="url(#cell-mask)"
        />
      </svg>
    );
  }
}

export default Column;
