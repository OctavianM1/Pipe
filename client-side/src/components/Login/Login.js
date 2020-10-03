import React, { useRef, useState } from "react";
import useOutsideAlerter from "../../Hooks/OutsideAlerter";
import "./login.scss";

import StandardButton from "../Buttons/StandardBtn/StandardButton";

const Login = ({ isOpenLoginModal, openRegisterModal }) => {
  const [signUp, setSignUp] = useState(openRegisterModal);
  const wrapper = useRef(null);
  useOutsideAlerter(wrapper, isOpenLoginModal);

  const [inputLoginLabel, setInputLoginLabel] = useState({
    email: false,
    password: false,
  });

  const [inputRegisterLabel, setInputRegisterLabel] = useState({
    email: false,
    password: false,
    name: false,
  });

  const [registerMobile, setRegisterMobile] = useState(false);

  const handleInputLoginLabel = (ev) => {
    if (ev.target.value !== "") {
      const newState = { ...inputLoginLabel };
      newState[ev.target.name] = true;
      setInputLoginLabel(newState);
    } else {
      const newState = { ...inputLoginLabel };
      newState[ev.target.name] = false;
      setInputLoginLabel(newState);
    }
  };

  const registerName = useRef(null);
  const registerEmail = useRef(null);
  const registerPassword = useRef(null);
  const loginEmail = useRef(null);
  const loginPassword = useRef(null);
  const handleClickOnLabel = (ref) => {
    ref.current.focus();
  };

  const handleRegisterLoginLabel = (ev) => {
    if (ev.target.value !== "") {
      const newState = { ...inputRegisterLabel };
      newState[ev.target.name] = true;
      setInputRegisterLabel(newState);
    } else {
      const newState = { ...inputRegisterLabel };
      newState[ev.target.name] = false;
      setInputRegisterLabel(newState);
    }
  };

  const handleLoginSubmit = (event) => {
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email);
    console.log(password);
    event.preventDefault();
  };

  const handleRegisterSubmit = (event) => {
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email);
    console.log(password);
    console.log(name);
    event.preventDefault();
  };

  const handleBlurName = (event) => {
    console.log(event.target);
  };

  const handleBlurEmail = (event) => {
    console.log(event.target);
  };

  const handleBlurPassword = (event) => {
    console.log(event.target);
  };

  let loginClasses = ["login-container"];
  if (signUp) {
    loginClasses.push("login-right-panel-active");
  } else if (registerMobile) {
    loginClasses.push("show-register-mobile");
  }

  return (
    <div className="login">
      <div
        ref={wrapper}
        className={loginClasses.join(" ")}
        id="login-container"
      >
        <div className="login-desktop">
          <div className="login-form-container login-sign-up-container">
            <form
              className="login-form"
              onSubmit={(ev) => handleRegisterSubmit(ev)}
            >
              <h1>Create Account</h1>
              <div className="login-social-container">
                <a href="/" className="login-social">
                  <img src="/images/login/logos/google.png" alt="google logo" />
                </a>
                <a href="/" className="login-social">
                  <img
                    src="/images/login/logos/facebook.png"
                    alt="facebook logo"
                  />
                </a>
              </div>
              <span className="login-span">
                or use your email for registration
              </span>
              <input
                className="login-input"
                name="name"
                type="text"
                placeholder="Name"
                onBlur={(ev) => handleBlurName(ev)}
              />
              <input
                className="login-input"
                name="email"
                type="email"
                placeholder="Email"
                onBlur={(ev) => handleBlurEmail(ev)}
              />
              <input
                className="login-input"
                name="password"
                type="password"
                placeholder="Password"
                onBlur={(ev) => handleBlurPassword(ev)}
              />
              <input
                className="login-button"
                type="submit"
                value="Sign Up"
              ></input>
            </form>
          </div>
          <div className="login-form-container login-sign-in-container">
            <form
              className="login-form"
              onSubmit={(ev) => handleLoginSubmit(ev)}
            >
              <h1 className="login-h1">Sign in</h1>
              <div className="login-social-container">
                <a href="/" className="login-social">
                  <img src="/images/login/logos/google.png" alt="google logo" />
                </a>
                <a href="/" className="login-social">
                  <img
                    src="/images/login/logos/facebook.png"
                    alt="facebook logo"
                  />
                </a>
              </div>
              <span className="login-span">or use your account</span>
              <input
                className="login-input"
                name="email"
                type="email"
                placeholder="Email"
                onBlur={(ev) => handleBlurEmail(ev)}
              />
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Password"
                onBlur={(ev) => handleBlurPassword(ev)}
              />
              <a className="login-a" href="/">
                Forgot your password?
              </a>
              <input
                type="submit"
                className="login-button"
                value="Sign In"
              ></input>
            </form>
          </div>
          <div className="login-overlay-container">
            <div className="login-overlay">
              <div className="login-overlay-panel login-overlay-left">
                <h1 className="login-h1">Welcome Back!</h1>
                <p className="login-p">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="login-button login-ghost"
                  id="login-signIn"
                  onClick={() => setSignUp(false)}
                >
                  Sign In
                </button>
              </div>
              <div className="login-overlay-panel login-overlay-right">
                <h1 className="login-h1">Hello, Friend!</h1>
                <p className="login-p">
                  Enter your personal details and start journey with us
                </p>
                <button
                  className="login-button login-ghost"
                  id="login-signUp"
                  onClick={() => setSignUp(true)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="login-mobile">
          <div className={registerMobile ? "register" : "display-none"}>
            <div className="register-side-login-btn">
              <StandardButton onClick={() => setRegisterMobile(false)}>
                Login
              </StandardButton>
            </div>


            {/* Mobile */}
            <div
              className={registerMobile ? "login-mobile-close" : "display-none"}
              onClick={() => isOpenLoginModal(false)}
            >
              &nbsp;
            </div>
            <h3 className="login-mobile-header">
              Register on Pipe<span>!</span>
            </h3>
            <div className="login-social-container">
              <a href="/" className="login-social">
                <img src="/images/login/logos/google.png" alt="google logo" />
              </a>
              <a href="/" className="login-social">
                <img
                  src="/images/login/logos/facebook.png"
                  alt="facebook logo"
                />
              </a>
            </div>
            <form
              className="login-mobile-form"
              onSubmit={(ev) => handleRegisterSubmit(ev)}
            >
              <div>
                <input
                  ref={registerName}
                  type="text"
                  name="name"
                  onChange={handleRegisterLoginLabel}
                  onBlur={(ev) => handleBlurName(ev)}
                />
                <div
                  className={
                    inputRegisterLabel["name"]
                      ? "filled-input"
                      : "non-filled-input"
                  }
                  onClick={() => handleClickOnLabel(registerName)}
                >
                  Name
                </div>
              </div>
              <div>
                <input
                  ref={registerEmail}
                  type="email"
                  name="email"
                  onChange={handleRegisterLoginLabel}
                  onBlur={(ev) => handleBlurEmail(ev)}
                />
                <div
                  className={
                    inputRegisterLabel["email"]
                      ? "filled-input"
                      : "non-filled-input"
                  }
                  onClick={() => handleClickOnLabel(registerEmail)}
                >
                  Email
                </div>
              </div>
              <div>
                <input
                  ref={registerPassword}
                  type="password"
                  name="password"
                  onChange={handleRegisterLoginLabel}
                  onBlur={(ev) => handleBlurPassword(ev)}
                />
                <div
                  className={
                    inputRegisterLabel["password"]
                      ? "filled-input"
                      : "non-filled-input"
                  }
                  onClick={() => handleClickOnLabel(registerPassword)}
                >
                  Password
                </div>
              </div>
              <input type="submit" value="Submit"></input>
            </form>
          </div>
          <div className={registerMobile ? "non-render" : ""}>
            <StandardButton onClick={() => setRegisterMobile(true)}>
              Register
            </StandardButton>
            <div
              className={registerMobile ? "display-none" : "login-mobile-close"}
              onClick={() => isOpenLoginModal(false)}
            >
              &nbsp;
            </div>
            <h3 className="login-mobile-header login-mobile-l-header">
              Welcome back to Pipe<span>!</span>
            </h3>
            <div className="login-social-container">
              <a href="/" className="login-social">
                <img src="/images/login/logos/google.png" alt="google logo" />
              </a>
              <a href="/" className="login-social">
                <img
                  src="/images/login/logos/facebook.png"
                  alt="facebook logo"
                />
              </a>
            </div>
            <form
              className="login-mobile-form"
              onSubmit={(ev) => handleLoginSubmit(ev)}
            >
              <div>
                <input
                  ref={loginEmail}
                  type="email"
                  name="email"
                  onChange={handleInputLoginLabel}
                  onBlur={(ev) => handleBlurEmail(ev)}
                />
                <div
                  className={
                    inputLoginLabel["email"]
                      ? "filled-input"
                      : "non-filled-input"
                  }
                  onClick={() => handleClickOnLabel(loginEmail)}
                >
                  Email
                </div>
              </div>
              <div>
                <input
                  ref={loginPassword}
                  type="password"
                  name="password"
                  onChange={handleInputLoginLabel}
                  onBlur={(ev) => handleBlurPassword(ev)}
                />
                <div
                  className={
                    inputLoginLabel["password"]
                      ? "filled-input"
                      : "non-filled-input"
                  }
                  onClick={() => handleClickOnLabel(loginPassword)}
                >
                  Password
                </div>
                <div className="login-mobile-forget-pass">
                  <a href="/">Forget Password?</a>
                </div>
              </div>
              <input type="submit" value="Submit"></input>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
