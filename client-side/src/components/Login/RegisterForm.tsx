import React, {
  Dispatch,
  FocusEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import { Users } from "../../api/axios";
import handleBlurPassword from "../../utilities/handleBlurPassword";

const RegisterForm = ({
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
  const [registerButtonActive, setRegisterButtonActive] = useState(true);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registerButtonActive || !nameRef.current || !emailRef.current || !passwordRef.current) return;
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
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
          closeSignUp();
          setRegisterButtonActive(true);
        })
        .catch((err: any) => {
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

  const handleBlurNameRegister = (event: FocusEvent<HTMLInputElement>) => {
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

  const handleBlurEmailRegister = (event: FocusEvent<HTMLInputElement>) => {
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
  return (
    <form className="login-form" onSubmit={handleRegisterSubmit}>
      <div className="login-title">
        <div className="login-social-container">
          <a href="/" className="login-social">
            <img src="/images/login/logos/google.png" alt="google logo" />
          </a>
        </div>
        <h1>Create Account</h1>
        <div className="login-social-container">
          <a href="/" className="login-social">
            <img src="/images/login/logos/facebook.png" alt="facebook logo" />
          </a>
        </div>
      </div>
      <span className="login-span">or use your email for registration</span>
      <input
        ref={nameRef}
        className="login-input"
        name="name"
        type="text"
        placeholder="Name"
        onBlur={handleBlurNameRegister}
      />
      <span className="login__logger">{loggers.nameRegisterLogger}</span>
      <input
        ref={emailRef}
        className="login-input"
        name="email"
        type="email"
        placeholder="Email"
        onBlur={handleBlurEmailRegister}
      />
      <span className="login__logger">{loggers.emailRegisterLogger}</span>
      <input
        ref={passwordRef}
        className="login-input"
        name="password"
        type="password"
        placeholder="Password"
        onBlur={(ev) =>
          handleBlurPassword(ev, dispatchLoggers, "password register")
        }
      />
      <span className="login__logger">{loggers.passwordRegisterLogger}</span>
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
  );
};

export default RegisterForm;
