import React from "react";
import "./postIntroductionSection.scss";
import Logo from "../../../components/Logo/Logo";

const PostIntroductionSection = () => {
  return (
    <div className="post-section">
      <div className="post-grid">
        <div className="logo-container">
          <Logo />
        </div>
        <div className="post-left-side">
          <h2>Follow on Pipe<span>.</span></h2>
          <p>
            Chat runs inside your Pipe team, which means no additional software
            to learn. Be available to chat with visitors on your website and
            your team members all in one place. Each conversation creates a new
            thread, allowing your team to manage it all from one place.
          </p>
        </div>
        <div className="post-right-side">
          <img src="/images/home/post-home-chat.svg" alt="chating" />
        </div>
      </div>
    </div>
  );
};

export default PostIntroductionSection;
