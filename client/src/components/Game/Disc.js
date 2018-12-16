import React from "react";
import { TweenMax, Bounce } from "gsap/all";

class Disc extends React.Component {
  state = {
    color: null
  };

  componentWillMount() {
    const color = this.props.player === 1 ? "#f1c40f" : "#e74c3c";
    this.setState({ color });
  }

  componentDidMount() {
    // disc falling animation
    TweenMax.fromTo(
      this.circle,
      0.5,
      { y: 0 },
      { y: this.props.cy, ease: Bounce.easeOut }
    );
  }

  render() {
    return (
      <circle
        ref={ref => (this.circle = ref)}
        cx={this.props.cx}
        r="45"
        fill={this.state.color}
      />
    );
  }
}

export default Disc;
