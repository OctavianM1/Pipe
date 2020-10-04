import React, { useState, useRef } from "react";
import "./Header.scss";
import "../../components/Buttons/BottomEffect/bottomEffect.scss";
import "../../components/Buttons/StandardBtn/standardButton.scss";
import HeaderLis from "./HeaderLis";
import Logo from "../../components/Logo/Logo";
import useOutsideAlerter from "../../Hooks/OutsideAlerter";

const Header = ({ openLoginModal, isOpenRegisterModal }) => {
  const [dropDown, setDropDown] = useState(false);

  const toggleDropDown = () => {
    setDropDown(!dropDown);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setDropDown, "menu-mobile-btn");

  return (
    <div className="header header-mobile">
      <a href="/">
        <Logo />
      </a>
      <ul className="info-side">
        <HeaderLis
          openLoginModal={openLoginModal}
          closeDropDown={() => setDropDown(false)}
          isOpenRegisterModal={isOpenRegisterModal}
        />
      </ul>
      <button
        className="menu-mobile-btn standard-btn"
        onClick={() => toggleDropDown()}
      >
        Menu
      </button>
      <div
        className={dropDown ? "drop-down-active" : "drop-down"}
        ref={wrapperRef}
      >
        <ul className="info-side-mobile">
          <HeaderLis
            openLoginModal={openLoginModal}
            closeDropDown={() => setDropDown(false)}
            isOpenRegisterModal={isOpenRegisterModal}
          />
        </ul>
      </div>
    </div>
  );
};

export default Header;
