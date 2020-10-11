import React from "react";

import "./closeBtn.scss";

const CloseBtn = ({ onClick }) => {
  return (
    <button className="close-btn" onClick={onClick}>
      &nbsp;
    </button>
  );
};

export default CloseBtn;
