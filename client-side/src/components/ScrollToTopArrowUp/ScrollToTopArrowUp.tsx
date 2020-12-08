import React, { useRef } from "react";
import './scrollToTopArrowUp.scss';
import useScrollToTop from "../../Hooks/useScrollToTop";

const ScrollToTopArrowUp = () => {
  const scrollToTopRef = useRef<HTMLDivElement>(null);
  useScrollToTop(scrollToTopRef);
  
  return (
    <div
      ref={scrollToTopRef}
      className="scrollToTopArrowUp scroll-to-top__hide"
    >
      <img src="/images/profile/black-arrow-pointing-up.svg" alt="arrow up" />
    </div>
  );
};

export default ScrollToTopArrowUp;
