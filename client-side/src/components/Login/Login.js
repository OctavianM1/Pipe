import React, { useRef, useState } from "react";
import useOutsideAlerter from "../../Hooks/OutsideAlerter";
import "./login.scss";

const Login = ({ isOpenLoginModal, openRegisterModal }) => {
  const [signUp, setSignUp] = useState(openRegisterModal);

  const wrapper = useRef(null);
  useOutsideAlerter(wrapper, isOpenLoginModal);

  const [nameRegisterLogger, setNameRegisterLogger] = useState("");
  const [emailRegisterLogger, setEmailRegisterLogger] = useState("");
  const [passwordRegisterLogger, setPasswordRegisterLogger] = useState("");

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

  const handleBlurNameRegister = (event) => {
    const name = event.target.value;
    if (name.trim().length < 2 && name.length > 0) {
      setNameRegisterLogger("Name cannot be less then 2 characters");
    } else {
      setNameRegisterLogger("");
    }
  };

  const handleBlurEmailRegister = (event) => {
    const email = event.target.value;
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!re.test(email) && email.length > 0) {
      setEmailRegisterLogger("Email is invalid");
    } else {
      setEmailRegisterLogger("");
    }
  };
  console.log('login');

  const handleBlurPasswordRegister = (event) => {
    const password = event.target.value;
    let log = [];
    if (password.length < 8) {
      log.push("8 charachters");
    }
    if (!/[a-zA-Z]+/g.test(password)) {
      log.push("a lowercase character or a uppercase character");
    }
    if (!/[\d\W]/g.test(password)) {
      log.push("a digit or a non alphanumeric charachter");
    }
    if (log.length !== 0 && log.length !== 3) {
      // log.length !== 3 -> 3 tests
      setPasswordRegisterLogger("Your password must contain " + log.join(", "));
    } else {
      setPasswordRegisterLogger("");
    }
  };

  const handleBlurEmailLogin = (event) => {
    console.log(event.target.value);
  };

  const handleBlurPasswordLogin = (event) => {
    console.log(event.target.value);
  };

  let loginClasses = ["login-container"];
  if (signUp) {
    loginClasses.push("login-right-panel-active");
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
              <div className="login-title">
                <div className="login-social-container">
                  <a href="/" className="login-social">
                    <img
                      src="/images/login/logos/google.png"
                      alt="google logo"
                    />
                  </a>
                </div>
                <h1>Create Account</h1>
                <div className="login-social-container">
                  <a href="/" className="login-social">
                    <img
                      src="/images/login/logos/facebook.png"
                      alt="facebook logo"
                    />
                  </a>
                </div>
              </div>
              <span className="login-span">
                or use your email for registration
              </span>
              <input
                className="login-input"
                name="name"
                type="text"
                placeholder="Name"
                onBlur={(ev) => handleBlurNameRegister(ev)}
              />
              <span className="login__logger">{nameRegisterLogger}</span>
              <input
                className="login-input"
                name="email"
                type="email"
                placeholder="Email"
                onBlur={(ev) => handleBlurEmailRegister(ev)}
              />
              <span className="login__logger">{emailRegisterLogger}</span>
              <input
                className="login-input"
                name="password"
                type="password"
                placeholder="Password"
                onBlur={(ev) => handleBlurPasswordRegister(ev)}
              />
              <span className="login__logger">{passwordRegisterLogger}</span>
              <input className="login-button" type="submit" value="Sign Up" />
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
                onBlur={(ev) => handleBlurEmailLogin(ev)}
              />
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Password"
                onBlur={(ev) => handleBlurPasswordLogin(ev)}
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
      </div>
    </div>
  );
};
export default Login;
