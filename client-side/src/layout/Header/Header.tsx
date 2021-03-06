import React, {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import "./Header.scss";
import "../../components/Buttons/BottomEffect/bottomEffect.scss";
import "../../components/Buttons/StandardBtn/standardButton.scss";
import HeaderLis from "./HeaderLis";
import Logo from "../../components/Logo/Logo";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import { Link } from "react-router-dom";

const Header = ({
  isOpenRegisterModal,
}: {
  isOpenRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [dropDown, setDropDown] = useState(false);
  const toggleDropDown = () => {
    setDropDown(!dropDown);
  };

  const wrapperRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(
    wrapperRef,
    dropDown,
    useCallback(() => setDropDown(false), []),
    "menu-mobile-btn"
  );

  return (
    <div className="header header-mobile">
      <Link to="/">
        <Logo />
      </Link>
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
        <ul className="info-side">
          <HeaderLis
            closeDropDown={() => setDropDown(false)}
            isOpenRegisterModal={isOpenRegisterModal}
          />
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Header);
