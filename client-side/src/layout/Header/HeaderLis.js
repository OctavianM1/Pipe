import React from "react";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";



const HeaderLis = ({openLoginModal, closeDropDown, isOpenRegisterModal}) => {
  const path = window.location.pathname;
  const onClickLoginMobile = () => {
    isOpenRegisterModal(false);
    openLoginModal();
    closeDropDown();
  }
  return (
    <>
      <li>
        <a
          href="/"
          className={path === "/" ? "bottom-effect-active" : "bottom-effect"}
        >
          Home
        </a>
      </li>
      <li>
        <a
          href="/features"
          className={
            path === "/features" ? "bottom-effect-active" : "bottom-effect"
          }
        >
          Features
        </a>
      </li>
      <li>
        <a
          href="/docs"
          className={
            path === "/docs" ? "bottom-effect-active" : "bottom-effect"
          }
        >
          Docs
        </a>
      </li>
      <li>
        <StandardButton onClick={onClickLoginMobile}>Login</StandardButton>
      </li>
    </>
  );
};

export default HeaderLis;
