import React from "react";
import "./standardButton.scss";

const StandardButton = props => {
  return (
    <button className="standard-btn" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default StandardButton;
