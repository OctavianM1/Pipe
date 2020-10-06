import React, { useContext } from "react";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";

import { Link, useLocation } from "react-router-dom";
import { Context } from "../../context";

const HeaderLis = ({ closeDropDown, isOpenRegisterModal }) => {
  const { pathname } = useLocation();

  const { isOpenLoginModal } = useContext(Context);

  const onClickLoginMobile = () => {
    isOpenRegisterModal(false);
    isOpenLoginModal(true);
    closeDropDown();
  };
  return (
    <>
      <li>
        <Link
          to="/"
          className={
            pathname === "/" ? "bottom-effect-active" : "bottom-effect"
          }
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/features"
          className={
            pathname === "/features" ? "bottom-effect-active" : "bottom-effect"
          }
        >
          Features
        </Link>
      </li>
      <li>
        <Link
          to="/docs"
          className={
            pathname === "/docs" ? "bottom-effect-active" : "bottom-effect"
          }
        >
          Docs
        </Link>
      </li>
      <li>
        <StandardButton onClick={onClickLoginMobile}>Login</StandardButton>
      </li>
    </>
  );
};

export default HeaderLis;
