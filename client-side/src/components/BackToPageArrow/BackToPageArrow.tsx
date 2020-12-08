import React from "react";
import SpanHoverFixedDisplayMsg from "../SpanHoverFixedDisplayMsg/SpanHoverFixedDisplayMsg";
import "./backToPageArrow.scss";

const BackToPageArrow = ({ prevPath }: { prevPath: string }) => {
  return (
    <div className="backToPageArrow">
      <img src="/images/back-left-arrows.svg" alt="arrow up" />
      <SpanHoverFixedDisplayMsg text={`Back to ${prevPath.slice(1)}`} />
    </div>
  );
};

export default BackToPageArrow;
 