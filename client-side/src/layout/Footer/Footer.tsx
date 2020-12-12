import React, { FormEvent, useEffect, useState } from "react";
import { Users } from "../../api/axios";
import Logo from "../../components/Logo/Logo";
import { CSSTransition } from "react-transition-group";

import "./footer.scss";
import "../../components/CSSTransitions/cssTransitions.scss";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";

const Footer = () => {
  const [subscribeBtnClasses, setSubscribeBtnClasses] = useState(
    "footer-subscribe__form__submit-initial"
  );

  const [isSubscribing, setIsSubscribing] = useState(false);

  const subscribedToEmail = JSON.parse(
    window.localStorage.getItem("subscribeToEmail") || "{}"
  );

  const error = useApiErrorHandler();

  const handleFocusInput = () => {
    setSubscribeBtnClasses("footer-subscribe__form__submit-black");
  };

  const handleBlurInput = () => {
    setSubscribeBtnClasses("footer-subscribe__form__submit-white");
  };

  useEffect(() => {
    if (subscribedToEmail && subscribedToEmail.email) {
      Users.isSubscribed(subscribedToEmail.email)
        .then((isEmailSubscribed: boolean) => {
          if (!isEmailSubscribed) {
            window.localStorage.setItem("subscribeToEmail", "{}");
          }
        })
        .catch(error);
    }
  }, [subscribedToEmail, error]);

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    const target = ev.target as any;
    const email = target.email.value;
    Users.subscribeToSendEmails({ email })
      .then(() => {
        window.localStorage.setItem(
          "subscribeToEmail",
          JSON.stringify({ email })
        );
        setIsSubscribing(true);
      })
      .catch(error);
    ev.preventDefault();
  };

  if (isSubscribing) {
    setTimeout(() => {
      setIsSubscribing(false);
    }, 8100);
  }

  return (
    <>
      {isSubscribing && (
        <div className="network-error">
          <h3>You successfully subscribed</h3>
          <p>
            We appriciate your feedback and we will send newsletters and we will
            let you know latest news and exclusive deals straight to your inbox!
          </p>
        </div>
      )}
      <div className="footer">
        <CSSTransition
          in={!subscribedToEmail || !subscribedToEmail.email}
          timeout={300}
          classNames="fade"
          unmountOnExit
        > 
          <div>
            <img
              src="/images/footer/landscape-subscribe.svg"
              alt="landscape svg"
            />
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
                <button
                  className={`footer-subscribe__form__submit ${subscribeBtnClasses}`}
                  type="submit"
                >
                  Subscribe<span>&nbsp;</span>
                </button>
              </form>
            </div>
          </div>
        </CSSTransition>
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
                <img
                  src="/images/footer/logos/twitter.svg"
                  alt="twitter logo"
                />
                <span>&nbsp;</span>
              </a>
              <a href="/">
                <img
                  src="/images/footer/logos/youtube.svg"
                  alt="youtube logo"
                />
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
    </>
  );
};

export default Footer;
