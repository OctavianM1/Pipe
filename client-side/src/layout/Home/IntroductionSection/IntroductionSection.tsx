import React, { Dispatch, SetStateAction } from "react";
import "./IntroductionSection.scss";
import Header1 from "../../../components/Headers/Header1";
import StandardButton from "../../../components/Buttons/StandardBtn/StandardButton";
import useScrollUpAndOpenLogin from "../../../Hooks/useScrollUpAndOpenLogin";
import { Link } from "react-router-dom";

const IntroductionSection = ({
  isOpenRegisterModal,
}: {
  isOpenRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const scrollUpAndOpenLogin = useScrollUpAndOpenLogin();

  const user = JSON.parse(window.localStorage.getItem("user") || "{}");

  const displayLogin = () => {
    isOpenRegisterModal(false);
    scrollUpAndOpenLogin();
  };

  const displayRegister = () => {
    isOpenRegisterModal(true);
    scrollUpAndOpenLogin();
  };

  return (
    <section
      style={{ backgroundImage: "url(/images/home/background-image-1.jpg)" }}
      className="introduction-section"
    >
      <div className="introduction-section-container">
        {user && user.id ? (
          <Header1>Welcome back to Pipe!</Header1>
        ) : (
          <Header1>Welcome to Pipe!</Header1>
        )}
        <div className="introduction-section-grid">
          <div>
            <img src="/images/home/chat-img.png" alt="Chat" loading="lazy" />
          </div>
          <div className="introduction-gird-col-2">
            <h2 className="introduction-header-2">
              Exchange your activities with other users on Pipe.
            </h2>
            <p>
              Start new relationships and get inspired by other users
              activities. Get notified. Watch your activity. All from inside
              Pipe.
            </p>
            {user && user.id ? (
              <div className="introduction-section-container__follow-btns">
                <Link to={"/followers"}>
                  <StandardButton>Followers</StandardButton>
                </Link>
                <Link to={"/following"}>
                  <StandardButton>Following</StandardButton>
                </Link>
              </div>
            ) : (
              <div>
                <StandardButton onClick={displayLogin}>Login</StandardButton>
                <StandardButton onClick={displayRegister}>
                  Register
                </StandardButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
