import React from "react";
import './Header.scss';

const Header1 = (props) => {
  return <h1 className="header-1">{props.children}</h1>;
};

export default Header1;
