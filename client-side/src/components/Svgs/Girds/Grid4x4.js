import React from "react";

const Grid4x4 = ({ active, onClick }) => {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 397.061 397.061"
      style={active ? { fill: "#5759ff" } : {}}
      onClick={onClick}
    >
      <rect x="104.49" y="208.98" width="83.592" height="83.592" />
      <rect x="104.49" y="0" width="83.592" height="83.592" />
      <rect x="104.49" y="313.469" width="83.592" height="83.592" />
      <rect x="104.49" y="104.49" width="83.592" height="83.592" />
      <rect x="5.224" y="208.98" width="78.367" height="83.592" />
      <rect x="5.224" y="313.469" width="78.367" height="83.592" />
      <rect x="5.224" y="0" width="78.367" height="83.592" />
      <rect x="5.224" y="104.49" width="78.367" height="83.592" />
      <rect x="208.98" y="208.98" width="83.592" height="83.592" />
      <rect x="313.469" y="104.49" width="78.367" height="83.592" />
      <rect x="313.469" y="208.98" width="78.367" height="83.592" />
      <rect x="313.469" y="0" width="78.367" height="83.592" />
      <rect x="208.98" y="313.469" width="83.592" height="83.592" />
      <rect x="208.98" y="104.49" width="83.592" height="83.592" />
      <rect x="208.98" y="0" width="83.592" height="83.592" />
      <rect x="313.469" y="313.469" width="78.367" height="83.592" />
    </svg>
  );
};

export default Grid4x4;
