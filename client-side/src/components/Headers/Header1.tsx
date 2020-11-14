import React from "react";
import "./Header.scss";

const Header1: React.FC = ({ children }) => {
  return <h1 className="header-1">{children}</h1>;
};

export default Header1;
