import React from "react";
import Header1 from "../../../components/Headers/Header1";
import "./ourFeatures.scss";

const OurFeatures = () => {
  return (
    <div className="our-features">
      <Header1>
        See what we're made of<span>.</span>
      </Header1>
      <div className="our-features-grid">
        <div className="element-container">
          <div className="element-container__upside">
            <img src="/images/home/ourfeatures/email.svg" alt="email logo" />
            <h2>Contact List</h2>
          </div>
          <p className="element-container__downside">
            Quickly and easily view your customer information or export a CSV to
            your favorite email platform.
          </p>
        </div>
        <div className="element-container">
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
        <div>
          <div className="element-container__upside">
            <img src="/images/home/ourfeatures/edit.svg" alt="edit logo" />
            <h2>Message Editing</h2>
          </div>
          <p className="element-container__downside">
            No need to fret over typos. Edit or delete messages even after
            they've been sent.
          </p>
        </div>
        <div>
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
        <div>
          <div className="element-container__upside">
            <img src="/images/home/ourfeatures/chat.svg" alt="chat logo" />
            <h2>Auto Messages</h2>
          </div>
          <p className="element-container__downside">
            Get the conversation started! Actively engage visitors with custom
            trigger messages.
          </p>
        </div>
        <div>
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
