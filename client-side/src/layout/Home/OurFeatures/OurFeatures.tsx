import React, { useRef } from "react";
import Header1 from "../../../components/Headers/Header1";
import useDisplayComponent from "../../../Hooks/useDisplayComponent";
import "./ourFeatures.scss";

const OurFeatures: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contactListRef = useRef<HTMLDivElement>(null);
  const customizableRef = useRef<HTMLDivElement>(null);
  const messageEditingRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const autoMessagesRef = useRef<HTMLDivElement>(null);
  const easilyInstallRef = useRef<HTMLDivElement>(null);

  const displayTitle = useDisplayComponent(titleRef, "bottom->top");
  const displayContactList = useDisplayComponent(contactListRef, "bottom->top");
  const displayCustomizable = useDisplayComponent(
    customizableRef,
    "bottom->top"
  );
  const displayMessageEditing = useDisplayComponent(
    messageEditingRef,
    "bottom->top"
  );
  const displayAnalytics = useDisplayComponent(analyticsRef, "bottom->top");
  const displayAutoMessages = useDisplayComponent(
    autoMessagesRef,
    "bottom->top"
  );
  const displayEasilyInstall = useDisplayComponent(
    easilyInstallRef,
    "bottom->top"
  );

  return (
    <div className="our-features">
      <Header1
        headerRef={titleRef}
        classes={displayTitle ? [""] : ["hidden__bottom"]}
      >
        See what we're made of<span>.</span>
      </Header1>
      <div className="our-features-grid">
        <div
          ref={contactListRef}
          className={`element-container ${
            displayContactList ? "" : "hidden__bottom"
          }`}
        >
          <div className="element-container__upside">
            <img
              src="/images/home/ourfeatures/email.svg"
              alt="email logo"
              loading="lazy"
            />
            <h2>Contact List</h2>
          </div>
          <p className="element-container__downside">
            Quickly and easily view your activity information and recieve emails
            on your favourite platform.
          </p>
        </div>
        <div
          ref={customizableRef}
          className={`element-container ${
            displayCustomizable ? "" : "hidden__bottom"
          }`}
        >
          <div className="element-container__upside">
            <img
              src="/images/home/ourfeatures/customize.svg"
              alt="email logo"
              loading="lazy"
            />
            <h2>Customizable</h2>
          </div>
          <p className="element-container__downside">
            Customize Pipe with easy styling that lets you seamlessly integrate
            with your brand.
          </p>
        </div>
        <div
          ref={messageEditingRef}
          className={`element-container ${
            displayMessageEditing ? "" : "hidden__bottom"
          }`}
        >
          <div className="element-container__upside">
            <img
              src="/images/home/ourfeatures/edit.svg"
              alt="edit logo"
              loading="lazy"
            />
            <h2>Message Editing</h2>
          </div>
          <p className="element-container__downside">
            No need to fret over typos. Edit or delete messages even after
            they've been sent.
          </p>
        </div>
        <div
          ref={analyticsRef}
          className={`element-container ${
            displayAnalytics ? "" : "hidden__bottom"
          }`}
        >
          <div className="element-container__upside">
            <img
              src="/images/home/ourfeatures/analytics.svg"
              alt="analytics logo"
              loading="lazy"
            />
            <h2>Analytics</h2>
          </div>
          <p className="element-container__downside">
            Track the number of interactions you're getting month to month. To
            see how your business is performing.
          </p>
        </div>
        <div
          ref={autoMessagesRef}
          className={`element-container ${
            displayAutoMessages ? "" : "hidden__bottom"
          }`}
        >
          <div className="element-container__upside">
            <img
              src="/images/home/ourfeatures/chat.svg"
              alt="chat logo"
              loading="lazy"
            />
            <h2>Auto Messages</h2>
          </div>
          <p className="element-container__downside">
            Get the conversation started! Actively engage visitors with custom
            trigger messages.
          </p>
        </div>
        <div
          ref={easilyInstallRef}
          className={`element-container ${
            displayEasilyInstall ? "" : "hidden__bottom"
          }`}
        >
          <div className="element-container__upside">
            <img
              src="/images/home/ourfeatures/install.svg"
              alt="chat logo"
              loading="lazy"
            />
            <h2>Easily Use</h2>
          </div>
          <p className="element-container__downside">
            Add a single embed script to your site. Tweak some settings, and
            your widget updates automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurFeatures;
