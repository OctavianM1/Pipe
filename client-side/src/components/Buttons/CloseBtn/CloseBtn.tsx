import React, {MouseEventHandler} from "react";
import "./closeBtn.scss";

interface CloseBtnProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const CloseBtn = ({ onClick }: CloseBtnProps) => {
  return (
    <button className="close-btn" onClick={onClick}>
      &nbsp;
    </button>
  );
};

export default CloseBtn;
