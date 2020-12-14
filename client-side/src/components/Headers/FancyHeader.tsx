import React from "react";
import './header.scss';

const FancyHeader: React.FC = ({ children }) => {
  return <h1 className="fancyHeader">{children}</h1>;
};

export default FancyHeader;
