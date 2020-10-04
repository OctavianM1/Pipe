import React, { useState } from "react";
import Logo from "../../components/Logo/Logo";

import "./footer.scss";

const Footer = () => {
  const [subscribeBtnClasses, setSubscribeBtnClasses] = useState([
    "footer-subscribe__form__submit",
    "footer-subscribe__form__submit-initial",
  ]);

  const handleFocusInput = () => {
    setSubscribeBtnClasses([
      "footer-subscribe__form__submit",
      "footer-subscribe__form__submit-black",
    ]);
  };

  const handleBlurInput = () => {
    setSubscribeBtnClasses([
      "footer-subscribe__form__submit",
      "footer-subscribe__form__submit-white",
    ]);
  };

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
            <input
              className="footer-subscribe__form__input"
              type="email"
              name="email"
              placeholder="Enter your email"
              onFocus={() => handleFocusInput()}
              onBlur={() => handleBlurInput()}
            />
            <button className={subscribeBtnClasses.join(" ")} type="submit">
              Subscribe<span>&nbsp;</span>
            </button>
          </form>
        </div>
      </div>
      <div>
        <img src="/images/footer/landscape.svg" alt="landscape svg" />
        <div className="footer-container">
          <div className="footer-container__logo">
            <Logo />
          </div>
          <div className="footer-container__body">
            <div className="footer-container__body__lists">
              <ul>
                <li>
                  <a href="/">Contact us</a>
                </li>
                <li>
                  <a href="/">Terms of Use</a>
                </li>
                <li>
                  <a href="/">Terms & Conditions</a>
                </li>
                <li>
                  <a href="/">FAQ</a>
                </li>
              </ul>
              <ul>
                <li>
                  <a href="/">Privacy Policy</a>
                </li>
                <li>
                  <a href="/">Cookie Policy</a>
                </li>
                <li>
                  <a href="/">Report a Scam</a>
                </li>
                <li>
                  <a href="/">All features</a>
                </li>
              </ul>
            </div>
            <div className="footer-container__body__quote">
              <h1>
                “There is only one rule for being a good talker – learn to
                listen.”
              </h1>
              <h2>Christopher Morley</h2>
            </div>
          </div>
          <div className="footer-container__media">
            <a href="/">
              <img
                src="/images/footer/logos/instagram.svg"
                alt="instagram logo"
              />
              <span>&nbsp;</span>
            </a>
            <a href="/">
              <img src="/images/footer/logos/twitter.svg" alt="twitter logo" />
              <span>&nbsp;</span>
            </a>
            <a href="/">
              <img src="/images/footer/logos/youtube.svg" alt="youtube logo" />
              <span>&nbsp;</span>
            </a>
            <a href="/">
              <img
                src="/images/footer/logos/linkedin.svg"
                alt="linkedin logo"
              />
              <span>&nbsp;</span>
            </a>
            <a href="/">
              <img
                src="/images/footer/logos/facebook.svg"
                alt="facebook logo"
              />
              <span>&nbsp;</span>
            </a>
          </div>
          <div className="footer-container__copyright">
            &copy; Pipe {new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
