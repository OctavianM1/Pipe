import React from "react";
import "./standardButton.scss";

const StandardButton = ({onClick, children}) => {
  return (
    <button className="standard-btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default StandardButton;
