import React from "react";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";

import Logo from "../../components/Logo/Logo";
import useScrollUpAndOpenLogin from "../../Hooks/useScrollUpAndOpenLogin";

import { useHistory } from "react-router-dom";

import "./unauthorized.scss";
import useDocumentTitle from "../../Hooks/useDocumentTitle";

const Unauthorized = () => {
  const history = useHistory();
  const scrollUpAndOpenLogin = useScrollUpAndOpenLogin();

  const userId = JSON.parse(window.localStorage.getItem("user") || "{}")["id"];

  if (userId) {
    history.goBack();
  }

  useDocumentTitle("Unauthorized", []);

  return (
    <div className="unauthorized">
      <div
        style={{
          backgroundImage:
            'url("/images/not-found/unauthorized-background.jpg")',
        }}
        className="unauthorized__container"
      >
        <div className="unauthorized__container--left">
          <div className="unauthorized__container--left__401">
            {!userId && <h1>401</h1>}
          </div>
          <div className="unauthorized__container--left__msg">
            {userId ? (
              <>
                <h1 className="unauthorized__container--left__msg__auth">
                  You are authorized, go to home page
                </h1>
                <StandardButton onClick={() => history.push("/")}>
                  Home
                </StandardButton>
              </>
            ) : (
              <>
                <h1>Unauthorized: Acces to this resource is denied.</h1>
                <StandardButton onClick={() => scrollUpAndOpenLogin()}>
                  Login
                </StandardButton>
              </>
            )}
          </div>
        </div>
        <div className="unauthorized__container--right">
          <div
            className="unauthorized__container--right__content"
            onClick={() => history.push("/")}
          >
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
