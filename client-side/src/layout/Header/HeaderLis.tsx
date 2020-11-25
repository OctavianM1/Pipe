import React, { Dispatch, SetStateAction, useContext } from "react";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";

import { Link, useLocation } from "react-router-dom";
import { Context } from "../../context";

import { useHistory } from "react-router-dom";

const HeaderLis = ({
  closeDropDown,
  isOpenRegisterModal,
}: {
  closeDropDown: () => void;
  isOpenRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { pathname } = useLocation();

  const { isOpenLoginModal } = useContext(Context);

  const user = JSON.parse(window.localStorage.getItem("user") || "{}");

  const history = useHistory();

  const onClickLogout = () => {
    window.localStorage.setItem("user", "{}");
    history.push("/");
  };

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

      {user && user.id ? (
        <>
          <li>
            <Link
              to="/followers"
              className={
                pathname === "/followers"
                  ? "bottom-effect-active"
                  : "bottom-effect"
              }
            >
              Followers
            </Link>
          </li>
          <li>
            <Link
              to="/following"
              className={
                pathname === "/following"
                  ? "bottom-effect-active"
                  : "bottom-effect"
              }
            >
              Following
            </Link>
          </li>
          <li>
            <Link
              to={`/activities/${user["id"]}`}
              className={
                pathname === `/activities/${user["id"]}`
                  ? "bottom-effect-active"
                  : "bottom-effect"
              }
            >
              My activities
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={
                pathname === "/profile"
                  ? "bottom-effect-active"
                  : "bottom-effect"
              }
            >
              Profile
            </Link>
          </li>
          <li>
            <StandardButton onClick={onClickLogout}>Logout</StandardButton>
          </li>
        </>
      ) : (
        <li>
          <StandardButton onClick={onClickLoginMobile}>Login</StandardButton>
        </li>
      )}
    </>
  );
};

export default HeaderLis;
