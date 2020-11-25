import React, {
  useContext,
  useReducer,
  useRef,
  useState,
  useCallback,
} from "react";
import "./login.scss";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import { Context } from "../../context";
import CloseBtn from "../Buttons/CloseBtn/CloseBtn";
import { CSSTransition } from "react-transition-group";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import ToggleLoginRegister from "./ToggleLoginRegister";

const Login = ({ openRegisterModal }: { openRegisterModal: boolean }) => {
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

  const { openLoginModal, isOpenLoginModal } = useContext(Context);

  const wrapper = useRef<HTMLDivElement>(null);

  const onCloseLoginModal = useCallback(() => {
    if (wrapper.current) {
      wrapper.current.classList.add("login-exit-active");
      wrapper.current.addEventListener("transitionend", function tran() {
        isOpenLoginModal(false);
        wrapper.current?.removeEventListener("transitionend", tran);
      });
    }
  }, [isOpenLoginModal]);

  useOutsideAlerter(wrapper, openLoginModal, onCloseLoginModal);


  let loginClasses = ["login-container"];
  if (signUp) {
    loginClasses.push("login-right-panel-active");
  }
  return (
    <div className="login">
      <CSSTransition in={true} appear={true} timeout={500} classNames="login">
        <div
          ref={wrapper}
          className={loginClasses.join(" ")}
          id="login-container"
        >
          <CloseBtn onClick={onCloseLoginModal} />
          <div className="login-desktop">
            <div className="login-form-container login-sign-up-container">
              <RegisterForm
                loggers={loggers}
                dispatchLoggers={dispatchLoggers}
                closeSignUp={() => setSignUp(false)}
              />
            </div>
            <div className="login-form-container login-sign-in-container">
              {loggers.loader && (
                <div className="login-form-container__loader">
                  <h2>Sending email...</h2>
                </div>
              )}
              <LoginForm
                loggers={loggers}
                dispatchLoggers={dispatchLoggers}
                closeSignUp={() => isOpenLoginModal(false)}
              />
            </div>
            <ToggleLoginRegister setSignUp={setSignUp} />
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};



interface LoggerState {
  nameRegisterLogger: string;
  emailRegisterLogger: string;
  passwordRegisterLogger: string;
  createdAccountLogger: string;
  emailLoginLogger: string;
  passwordLoginLogger: string;
  loader: boolean;
}

function loggerReducer(
  state: LoggerState,
  action: { type: string; msg?: string }
) {
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
        passwordLoginLogger: "",
        createdAccountLogger: "",
        loader: false,
      };
    case "password login":
      return {
        ...state,
        passwordLoginLogger: action.msg || "",
        emailLoginLogger: "",
        createdAccountLogger: "",
        loader: false,
      };
    case "remove all":
      return {
        nameRegisterLogger: "",
        emailRegisterLogger: "",
        passwordRegisterLogger: "",
        createdAccountLogger: "",
        emailLoginLogger: "",
        passwordLoginLogger: "",
        loader: false,
      };
    case "active loader":
      return { ...state, loader: true };
    default:
      throw Error("Invalid action on logger reducer");
  }
}

export default Login;
