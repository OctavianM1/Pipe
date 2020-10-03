import React from "react";

import "./footer.scss";

const Footer = () => {
  const handleFocusInput = () => {

  }

  const handleSubmit = (ev) => {
    console.log(ev.target.email.value);
    ev.preventDefault();
  };

  return (
    <div className="footer">
      <div>
        <img src="/images/footer/landscape-subscribe.svg" alt="landscape svg" />
        <div className="footer-subscribe">
          <form
            className="footer-subscribe__form"
            onSubmit={(ev) => handleSubmit(ev)}
          >
            <div className="footer-subscribe__form__input">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onFocus={() => handleFocusInput()}
              />
            </div>
            <div className="footer-subscribe__form__submit-black">
              <button type="submit">Subscribe</button>
              <span>&nbsp;</span>
            </div>
          </form>
        </div>
      </div>
      <div>
        <img src="/images/footer/landscape.svg" alt="landscape svg" />
        <div className="footer-container"></div>
      </div>
    </div>
  );
};

export default Footer;
