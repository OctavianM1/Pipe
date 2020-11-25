import React, { Dispatch, FormEvent } from "react";
import { Users } from "../../api/axios";
import { ServerUser } from "../../api/serverDataInterfaces";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";

const LoginForm = ({
  loggers,
  dispatchLoggers,
  closeSignUp,
}: {
  loggers: {
    nameRegisterLogger: string;
    emailRegisterLogger: string;
    passwordRegisterLogger: string;
    createdAccountLogger: string;
    emailLoginLogger: string;
    passwordLoginLogger: string;
    loader: boolean;
  };
  dispatchLoggers: Dispatch<{
    type: string;
    msg?: string | undefined;
  }>;
  closeSignUp: () => void;
}) => {
  const error = useApiErrorHandler();

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    const evTarget = event.target as any;
    const email = evTarget.email.value;
    const password = evTarget.password.value;
    Users.login({ email, password })
      .then((data: ServerUser) => {
        dispatchLoggers({ type: "remove all" });
        window.localStorage.setItem("user", JSON.stringify(data));
        closeSignUp();
      })
      .catch((err: any) => {
        error(err, () => {
          const errors = err.data.errors;
          if (errors.email) {
            dispatchLoggers({ type: "email login", msg: errors.email });
          }
          if (errors.password) {
            dispatchLoggers({ type: "password login", msg: errors.password });
          }
        });
      });
    event.preventDefault();
  };

  const sendPasswordRecovery = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    if (!loggers.loader) {
      const email = evTarget.parentElement.email.value.trim();
      onSendEmail(email, dispatchLoggers, Users.sendRecoveryPassword);
    }
  };

  const sendConfirmationEmail = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    if (!loggers.loader) {
      const email = evTarget.parentElement.email.value.trim();
      onSendEmail(email, dispatchLoggers, Users.sendConfirmationEmail);
    }
  };
  return (
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
          <img src="/images/login/logos/facebook.png" alt="facebook logo" />
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
      <span className="login__logger">{loggers.passwordLoginLogger}</span>
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
      <input type="submit" className="login-button" value="Sign In" />
    </form>
  );
};

function onSendEmail(
  email: string,
  dispatchLoggers: Dispatch<{
    type: string;
    msg?: string | undefined;
  }>,
  methodToSendEmail: (email: string) => Promise<string>
) {
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
    .then((msg: string) => {
      dispatchLoggers({ type: "create account", msg });
    })
    .catch((err: any) => {
      console.log(err);
      if ((err.status === 404 || err.status === 400) && err.data.errors.email) {
        dispatchLoggers({ type: "email login", msg: err.data.errors.email });
      }
    });
}

export default LoginForm;
