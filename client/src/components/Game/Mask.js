import React from "react";

const Mask = props => {
  return (
    <defs>
      <pattern
        id="cell-pattern"
        patternUnits="userSpaceOnUse"
        width="100"
        height="100"
      >
        <circle cx="50" cy="50" r="45" fill="black" />
      </pattern>
      <mask id="cell-mask">
        <rect width="100" height="600" fill="white" />
        <rect width="100" height="600" fill="url(#cell-pattern)" />
      </mask>
    </defs>
  );
};

export default Mask;
