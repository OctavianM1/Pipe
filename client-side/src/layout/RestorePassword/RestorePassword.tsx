import React, { FormEvent, useReducer, useState, FocusEvent } from "react";
import { useHistory, useParams } from "react-router-dom";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import "./restorePassword.scss";
import UpLabelInput from "../../components/UpLabelInput/UpLabelInput";
import handleBlurPassword from "../../utilities/handleBlurPassword";
import { Users } from "../../api/axios";
import useScrollUpAndOpenLogin from "../../Hooks/useScrollUpAndOpenLogin";
import jwt_decode from "jwt-decode";
import useIsMounted from "../../Hooks/useIsMounted";
import useDocumentTitle from "../../Hooks/useDocumentTitle";

const RestorePassword = () => {
  const idMountedRef = useIsMounted();
  const [restoreLoggers, dispatchRestoreLoggers] = useReducer(
    restoreLoggersReducer,
    {
      successRecovered: false,
      passwordLogger: "",
      passwordLabel: false,
      confirmedPasswordLogger: "",
      confirmedPasswordLabel: false,
    }
  );

  const history = useHistory();

  const user = JSON.parse(window.localStorage.getItem("user") || "{}");
  if (user && user.id) {
    history.push("/");
  }

  const [validToken, setValidToken] = useState(false);

  const { token } = useParams<{ token: string }>();

  let decodedToken:
    | { nameid: string; nbf: number; exp: number; iat: number }
    | any;
  try {
    decodedToken = jwt_decode(token);
    if (!validToken) {
      setValidToken(true);
    }
  } catch {
    if (validToken) {
      setValidToken(false);
    }
  }

  useDocumentTitle("Restore password", []);

  const openLogin = useScrollUpAndOpenLogin();

  const submitRestorePassword = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const evTarget = ev.target as any;
    const passInput = evTarget.newPassword[0];
    const pass = passInput.value.trim();
    const confirmedPassInput = evTarget.confirmNewPassword[0];
    const confirmedPass = confirmedPassInput.value.trim();
    if (pass.length === 0) {
      dispatchRestoreLoggers({ type: "empty password" });
    }
    if (confirmedPass.length === 0) {
      dispatchRestoreLoggers({ type: "empty confirmed password" });
    }
    if (
      !restoreLoggers.passwordLogger &&
      !restoreLoggers.confirmedPasswordLogger &&
      pass.length > 0 &&
      evTarget.confirmNewPassword[0].value.trim() === pass
    ) {
      Users.recoveryPassword({ email: decodedToken.nameid, password: pass })
        .then(() => {
          passInput.value = "";
          confirmedPassInput.value = "";
          if (idMountedRef) {
            dispatchRestoreLoggers({ type: "success recovered" });
          }
        })
        .catch((err: any) => console.log(err));
    }
  };

  const handleBlurInput = (ev: FocusEvent<HTMLInputElement>) => {
    const evTarget = ev.target as any;
    const target = evTarget.name;
    const val = evTarget.value.trim();
    if (target === "newPassword") {
      if (val.length > 0) {
        dispatchRestoreLoggers({ type: "active password label" });
      } else {
        dispatchRestoreLoggers({ type: "inactive password label" });
      }
      handleBlurPassword(ev, dispatchRestoreLoggers, "new password");
    } else if (target === "confirmNewPassword") {
      if (val.length > 0) {
        const newPasswordValue = evTarget.parentElement.parentElement.parentElement.parentElement.firstChild.firstChild.firstChild.firstChild.value.trim();
        if (val !== newPasswordValue) {
          dispatchRestoreLoggers({ type: "incorrect confirm password" });
        } else {
          dispatchRestoreLoggers({ type: "active confirmed password label" });
        }
      } else {
        dispatchRestoreLoggers({ type: "inactive confirmed password label" });
      }
    }
  };

  const handleFocusInput = (ev: FocusEvent<HTMLInputElement>) => {
    const target = ev.target.name;
    if (target === "newPassword") {
      dispatchRestoreLoggers({ type: "active password label" });
    } else if (target === "confirmNewPassword") {
      dispatchRestoreLoggers({ type: "active confirmed password label" });
    }
  };

  const toggleShowPassword = (
    ev: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    const input = evTarget.parentElement.firstChild.firstChild.firstChild;
    input.type = input.type === "text" ? "password" : "text";
  };

  return (
    <div className="restorePassword">
      {restoreLoggers.successRecovered && (
        <div className="restorePassword__success">
          <h1>You successfully restore password!</h1>
          <h2>Now you can login</h2>
          <StandardButton onClick={openLogin}>Login</StandardButton>
        </div>
      )}
      {validToken && !restoreLoggers.successRecovered && (
        <>
          <form onSubmit={submitRestorePassword}>
            <div className="restorePassword__input">
              <UpLabelInput
                handleBlurInput={handleBlurInput}
                handleFocusInput={handleFocusInput}
                label={restoreLoggers.passwordLabel}
                labelName="New Password"
                logger={!!restoreLoggers.passwordLogger}
                loggerText={restoreLoggers.passwordLogger}
                name={"newPassword"}
                type="password"
              />
              <input
                type="checkbox"
                name="newPassword"
                id="newPassword"
                onClick={toggleShowPassword}
              />
              <label htmlFor="newPassword">Show</label>
            </div>
            <div className="restorePassword__input">
              <UpLabelInput
                handleBlurInput={handleBlurInput}
                handleFocusInput={handleFocusInput}
                label={restoreLoggers.confirmedPasswordLabel}
                labelName="Confirm new password"
                logger={!!restoreLoggers.confirmedPasswordLogger}
                loggerText={restoreLoggers.confirmedPasswordLogger}
                name={"confirmNewPassword"}
                type="password"
              />
              <input
                type="checkbox"
                name="confirmNewPassword"
                id="confirmNewPassword"
                onClick={toggleShowPassword}
              />
              <label htmlFor="confirmNewPassword">Show</label>
            </div>
            <StandardButton
              classNames={["submit-restore-password"]}
              type="submit"
            >
              Submit
            </StandardButton>
          </form>
        </>
      )}
      {!validToken && (
        <div>
          <h1 className="restorePassword__fail-h1">Something went wrong!</h1>
          <h2 className="restorePassword__fail-h2">
            We couldn't find your restore email request
          </h2>
        </div>
      )}
    </div>
  );
};

interface LoggersState {
  successRecovered: boolean;
  passwordLogger: string | undefined;
  passwordLabel: boolean;
  confirmedPasswordLogger: string | undefined;
  confirmedPasswordLabel: boolean;
}

function restoreLoggersReducer(
  state: LoggersState,
  action: { type: string; msg?: string }
) {
  switch (action.type) {
    case "active password label":
      return { ...state, passwordLabel: true };
    case "inactive password label":
      return { ...state, passwordLabel: false };
    case "active confirmed password label":
      return {
        ...state,
        confirmedPasswordLabel: true,
        confirmedPasswordLogger: "",
      };
    case "inactive confirmed password label":
      return { ...state, confirmedPasswordLabel: false };
    case "new password":
      return { ...state, passwordLogger: action.msg };
    case "incorrect confirm password":
      return {
        ...state,
        confirmedPasswordLabel: true,
        confirmedPasswordLogger: "The confirmed password is incorrect",
      };
    case "empty password":
      return { ...state, passwordLogger: "Password cannot be empty" };
    case "empty confirmed password":
      return {
        ...state,
        confirmedPasswordLogger: "You need to confirm password!",
      };
    case "doesn't match":
      return { ...state, confirmedPasswordLogger: "asd" };
    case "success recovered":
      return {
        successRecovered: true,
        passwordLogger: "",
        passwordLabel: false,
        confirmedPasswordLogger: "",
        confirmedPasswordLabel: false,
      };
    default:
      throw Error(`Error action type: ${action.type}`);
  }
}

export default RestorePassword;
