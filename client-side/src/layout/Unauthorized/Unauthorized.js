import React from "react";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";

import Logo from "../../components/Logo/Logo";
import useScrollUpAndOpenLogin from "../../Hooks/useScrollUpAndOpenLogin";

import "./unauthorized.scss";

const Unauthorized = () => {
  const scrollUpAndOpenLogin = useScrollUpAndOpenLogin();
  return (
    <div className="unauthorized">
      <div className="unauthorized__container">
        <div className="unauthorized__container--left">
          <div className="unauthorized__container--left__401">
            <h1>401</h1>
          </div>
          <div className="unauthorized__container--left__msg">
            <h1>Unauthorized: Acces to this resource is denied.</h1>
            <StandardButton onClick={() => scrollUpAndOpenLogin()}>Login</StandardButton>
          </div>
        </div>
        <div className="unauthorized__container--right">
          <div className="unauthorized__container--right__content">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;