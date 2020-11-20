import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopTransaction: React.FC = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTopTransaction;
