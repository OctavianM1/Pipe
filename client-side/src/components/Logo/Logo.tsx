import React from "react";
import './logo.scss';

const Logo = () => {
  return (
    <div className="logo-side">
      <img src="/images/logo/circle-cropped.png" alt="Pipe logo" />
      <h1>
        <div className="char-1">P</div>
        <div className="char-2">i</div>
        <div className="char-3">p</div>
        <div className="char-4">
          e<sup>&copy;</sup>
        </div>
      </h1>
    </div>
  );
};

export default Logo;