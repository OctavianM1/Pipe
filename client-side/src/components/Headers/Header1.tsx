import React, { RefObject } from "react";
import "./Header.scss";

const Header1: React.FC<{
  headerRef?: RefObject<HTMLHeadingElement>;
  classes?: string[];
}> = ({ children, headerRef, classes }) => {
  return (
    <h1 ref={headerRef} className={`header-1 ${classes?.join(" ")}`}>
      {children}
    </h1>
  );
};
 
export default Header1;
