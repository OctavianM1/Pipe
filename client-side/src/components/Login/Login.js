import React, { useContext, useReducer, useRef, useState } from "react";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import "./login.scss";

import { Users } from "../../api/axios";
import { Context } from "../../context";
import CloseBtn from "../Buttons/CloseBtn/CloseBtn";
import handleBlurPassword from "../../utilities/handleBlurPassword";

const Login = ({ openRegisterModal }) => {
  const [signUp, setSignUp] = useState(openRegisterModal);
  const [loggers, dispatchLoggers] = useReducer(loggerReducer, {
    nameRegisterLogger: "",
    emailRegisterLogger: "",
    passwordRegisterLogger: "",
    createdAccountLogger: "",
    emailLoginLogger: "",
    passwordLoginLogger: "",
    loader: false,
  });

  const { isOpenLoginModal } = useContext(Context);

  const wrapper = useRef(null);
  useOutsideAlerter(wrapper, isOpenLoginModal);

  const [registerButtonActive, setRegisterButtonActive] = useState(true);

  const handleLoginSubmit = (event) => {
    const email = event.target.email.value;
    const password = event.target.password.value;
    Users.login({ email, password })
      .then((data) => {
        dispatchLoggers({ type: "remove all" });
        window.localStorage.setItem("user", JSON.stringify(data));
        isOpenLoginModal(false);
      })
      .catch((err) => {
        const errors = err.data.errors;
        if (errors.email) {
          dispatchLoggers({ type: "email login", msg: errors.email });
        }
        if (errors.password) {
          dispatchLoggers({ type: "password login", msg: errors.password });
        }
      });
    event.preventDefault();
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (!registerButtonActive) return;
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    if (
      loggers.nameRegisterLogger === "" &&
      loggers.emailRegisterLogger === "" &&
      loggers.passwordRegisterLogger === "" &&
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== ""
    ) {
      const user = { name, email, password };
      setRegisterButtonActive(false);
      Users.create(user)
        .then(() => {
          dispatchLoggers({
            type: "create account",
            msg: `A confrimation email was sent to ${email}&Please confirm your email`,
          });
          setSignUp(false);
          setRegisterButtonActive(true);
        })
        .catch((err) => {
          if (err.status === 400 && err.data.errors.email) {
            dispatchLoggers({
              type: "email register",
              msg: err.data.errors.email,
            });
          }
          setRegisterButtonActive(true);
        });
    } else {
      if (name.trim().length === 0) {
        dispatchLoggers({ type: "name register", msg: "Name cannot be empty" });
      }
      if (email.trim().length === 0) {
        dispatchLoggers({
          type: "email register",
          msg: "Email cannot be empty",
        });
      }
      if (password.trim().length === 0) {
        dispatchLoggers({
          type: "password register",
          msg: "Password cannot be empty",
        });
      }
    }
  };

  const handleBlurNameRegister = (event) => {
    const name = event.target.value;
    if (name.trim().length < 2 && name.length > 0) {
      dispatchLoggers({
        type: "name register",
        msg: "Name cannot be less then 2 characters",
      });
    } else {
      dispatchLoggers({
        type: "name register",
        msg: "",
      });
    }
  };

  const handleBlurEmailRegister = (event) => {
    const email = event.target.value;
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!re.test(email) && email.length > 0) {
      dispatchLoggers({
        type: "email register",
        msg: "Email is invalid",
      });
    } else {
      dispatchLoggers({
        type: "email register",
        msg: "",
      });
    }
  };

  const sendPasswordRecovery = (ev) => {
    if (!loggers.loader) {
      const email = ev.target.parentElement.email.value.trim();
      onSendEmail(email, dispatchLoggers, Users.sendRecoveryPassword);
    }
  };

  const sendConfirmationEmail = (ev) => {
    if (!loggers.loader) {
      const email = ev.target.parentElement.email.value.trim();
      onSendEmail(email, dispatchLoggers, Users.sendConfirmationEmail);
    }
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
        <CloseBtn onClick={() => isOpenLoginModal(false)} />
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
              <span className="login__logger">
                {loggers.nameRegisterLogger}
              </span>
              <input
                className="login-input"
                name="email"
                type="email"
                placeholder="Email"
                onBlur={(ev) => handleBlurEmailRegister(ev)}
              />
              <span className="login__logger">
                {loggers.emailRegisterLogger}
              </span>
              <input
                className="login-input"
                name="password"
                type="password"
                placeholder="Password"
                onBlur={(ev) =>
                  handleBlurPassword(ev, dispatchLoggers, "password register")
                }
              />
              <span className="login__logger">
                {loggers.passwordRegisterLogger}
              </span>
              <input
                className={
                  registerButtonActive
                    ? "login-button"
                    : "login-button login-button-disable"
                }
                type="submit"
                value="Sign Up"
              />
            </form>
          </div>
          <div className="login-form-container login-sign-in-container">
            {loggers.loader && (
              <div className="login-form-container__loader">
                <h2>Sending email...</h2>
              </div>
            )}
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <h1 className="login-h1">Sign in</h1>
              <span className="login-create-account-text">
                {loggers.createdAccountLogger.split("&")[0]}
                <br></br>
                {loggers.createdAccountLogger.split("&")[1]}
              </span>
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
              />
              <span className="login__logger">{loggers.emailLoginLogger}</span>
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Password"
              />
              <span className="login__logger">
                {loggers.passwordLoginLogger}
              </span>
              <button
                type="button"
                onClick={sendPasswordRecovery}
                id="hum1"
                className="humble-button"
              >
                Send password recovery
              </button>
              <button
                type="button"
                onClick={sendConfirmationEmail}
                id="hum2"
                className="humble-button"
              >
                Send confirmation email
              </button>
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

function onSendEmail(email, dispatchLoggers, methodToSendEmail) {
  if (email.length === 0) {
    dispatchLoggers({ type: "email login", msg: "Email cannot be empty" });
    return;
  }
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!re.test(email)) {
    dispatchLoggers({ type: "email login", msg: "Invalid Email" });
    return;
  }
  dispatchLoggers({ type: "active loader" });
  methodToSendEmail(email)
    .then((msg) => {
      dispatchLoggers({ type: "create account", msg });
    })
    .catch((err) => {
      console.log(err);
      if ((err.status === 404 || err.status === 400) && err.data.errors.email) {
        dispatchLoggers({ type: "email login", msg: err.data.errors.email });
      }
    });
}

function loggerReducer(state, action) {
  switch (action.type) {
    case "name register":
      return { ...state, nameRegisterLogger: action.msg || "" };
    case "email register":
      return { ...state, emailRegisterLogger: action.msg || "" };
    case "password register":
      return { ...state, passwordRegisterLogger: action.msg || "" };
    case "create account":
      return {
        ...state,
        createdAccountLogger: action.msg || "",
        emailLoginLogger: "",
        loader: false,
      };
    case "email login":
      return {
        ...state,
        emailLoginLogger: action.msg || "",
        createdAccountLogger: "",
        loader: false,
      };
    case "password login":
      return {
        ...state,
        passwordLoginLogger: action.msg || "",
        createdAccountLogger: "",
      };
    case "remove all":
      return {
        nameRegisterLogger: "",
        emailRegisterLogger: "",
        passwordRegisterLogger: "",
        createdAccountLogger: "",
        emailLoginLogger: "",
        passwordLoginLogger: "",
      };
    case "active loader":
      return { ...state, loader: true };
    default:
      throw Error("Invalid action on logger reducer");
  }
}

export default Login;
