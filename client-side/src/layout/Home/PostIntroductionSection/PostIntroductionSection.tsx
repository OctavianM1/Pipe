import React, { useRef } from "react";
import "./postIntroductionSection.scss";
import Logo from "../../../components/Logo/Logo";
import useDisplayComponent from "../../../Hooks/useDisplayComponent";

const PostIntroductionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const displaySection = useDisplayComponent(sectionRef, "small->normal");

  return (
    <div
      ref={sectionRef}
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.5),rgba(0, 0, 0, 0.5)),url("/images/home/background-image-2.jpg")',
      }}
      className={`post-section ${displaySection ? "" : "hidden__small"}`}
    >
      <div className="post-grid">
        <div className="logo-container">
          <Logo />
        </div>
        <div className="post-left-side">
          <h2>
            Follow on Pipe<span>.</span>
          </h2>
          <p>
            <span style={{ marginLeft: "15px" }}>&nbsp;</span>Project runs
            inside Pipe host, which means no additional software to learn. Be
            available to communicate with all followers on your account in one
            place. Each conversation creates a new thread, allowing your all
            followers to be notified from one place.
          </p>
        </div>
        <div className="post-right-side">
          <img
            src="/images/home/post-home-chat.png"
            alt="chating"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default PostIntroductionSection;
