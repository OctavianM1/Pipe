import React from "react";
import Header1 from "../../../components/Headers/Header1";
import StandardButton from "../../../components/Buttons/StandardBtn/StandardButton";
import "./IntroductionSection.scss";
import useScrollUpAndOpenLogin from "../../../Hooks/useScrollUpAndOpenLogin";

const IntroductionSection = ({ isOpenRegisterModal }) => {
  const scrollUpAndOpenLogin = useScrollUpAndOpenLogin();

  const displayLogin = () => {
    isOpenRegisterModal(false);
    scrollUpAndOpenLogin();
  };

  const displayRegister = () => {
    isOpenRegisterModal(true);
    scrollUpAndOpenLogin();
  };

  return (
    <section className="introduction-section">
      <div className="introduction-section-container">
        <Header1>Welcome to Pipe!</Header1>
        <div className="introduction-section-grid">
          <div>
            <img src="/images/home/chat-img.svg" alt="Chat"></img>
          </div>
          <div className="introduction-gird-col-2">
            <h2 className="introduction-header-2">
              Talk to your visitors without leaving Pipe.
            </h2>
            <p>
              Start conversations with visitors on your website through
              Smallchat and convert those visitors into customers. All from
              inside Pipe.
            </p>
            <div>
              <StandardButton onClick={displayLogin}>Login</StandardButton>
              <StandardButton onClick={displayRegister}>
                Register
              </StandardButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
