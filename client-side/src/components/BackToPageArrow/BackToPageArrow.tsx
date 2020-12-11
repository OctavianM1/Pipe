import React from "react";
import { Link } from "react-router-dom";
import SpanHoverFixedDisplayMsg from "../SpanHoverFixedDisplayMsg/SpanHoverFixedDisplayMsg";
import "./backToPageArrow.scss";

const BackToPageArrow = ({ prevPath }: { prevPath: string }) => {
  return (
    <Link to={prevPath} className="backToPageArrow">
      <img src="/images/back-left-arrows.svg" alt="arrow up" />
      <SpanHoverFixedDisplayMsg text={`Back to ${prevPath.slice(1)}`} />
    </Link>
  );
};

export default BackToPageArrow;
