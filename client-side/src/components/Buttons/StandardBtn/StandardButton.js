import React from "react";
import "./standardButton.scss";

const StandardButton = ({ onClick, children, type, classNames }) => {
  return (
    <button
      className={`standard-btn ${classNames ? classNames.join(" ") : ""}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default StandardButton;
