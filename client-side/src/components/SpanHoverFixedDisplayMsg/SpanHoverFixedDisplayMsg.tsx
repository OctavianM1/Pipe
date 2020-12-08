import React from "react";
import "./spanHoverFixedDisplayMsg.scss";

const SpanHoverFixedDisplayMsg = ({ text }: { text: string }) => {
  return (
    <span className="spanHoverFixedDisplayMsg">
      {text}
      <span className="bottom-right-icon-arrow">&nbsp;</span>
    </span>
  );
};

export default SpanHoverFixedDisplayMsg;
