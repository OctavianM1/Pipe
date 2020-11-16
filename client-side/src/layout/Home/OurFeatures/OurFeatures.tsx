import React, { useRef, useState } from "react";
import Header1 from "../../../components/Headers/Header1";
import useDisplayComponent from "../../../Hooks/useDisplayComponent";
import "./ourFeatures.scss";

const OurFeatures: React.FC = () => {
  const [displayTitle, setDisplayTitle] = useState(false);
  const [displayContactList, setDisplayContactList] = useState(false);
  const [displayCustomizable, setDisplayCustomizable] = useState(false);
  const [displayMessageEditing, setDisplayMessageEditing] = useState(false);
  const [displayAnalytics, setDisplayAnalytics] = useState(false);
  const [displayAutoMessages, setDisplayAutoMessages] = useState(false);
  const [displayEasilyInstall, setDisplayEasilyInstall] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const contactListRef = useRef<HTMLDivElement>(null);
  const customizableRef = useRef<HTMLDivElement>(null);
  const messageEditingRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const autoMessagesRef = useRef<HTMLDivElement>(null);
  const easilyInstallRef = useRef<HTMLDivElement>(null);

  useDisplayComponent(titleRef, displayTitle, setDisplayTitle, "bottom->top");
  useDisplayComponent(
    contactListRef,
    displayContactList,
    setDisplayContactList,
    "bottom->top"
  );
  useDisplayComponent(
    customizableRef,
    displayCustomizable,
    setDisplayCustomizable,
    "bottom->top"
  );
  useDisplayComponent(
    messageEditingRef,
    displayMessageEditing,
    setDisplayMessageEditing,
    "bottom->top"
  );
  useDisplayComponent(
    analyticsRef,
    displayAnalytics,
    setDisplayAnalytics,
    "bottom->top"
  );
  useDisplayComponent(
    autoMessagesRef,
    displayAutoMessages,
    setDisplayAutoMessages,
    "bottom->top"
  );
  useDisplayComponent(
    easilyInstallRef,
    displayEasilyInstall,
    setDisplayEasilyInstall,
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
            <img src="/images/home/ourfeatures/email.svg" alt="email logo" />
            <h2>Contact List</h2>
          </div>
          <p className="element-container__downside">
            Quickly and easily view your customer information or export a CSV to
            your favorite email platform.
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
            <img src="/images/home/ourfeatures/edit.svg" alt="edit logo" />
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
            <img src="/images/home/ourfeatures/chat.svg" alt="chat logo" />
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
            <img src="/images/home/ourfeatures/install.svg" alt="chat logo" />
            <h2>Easily Install</h2>
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
