import React, { useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Users } from "../../api/axios";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import Loader from "../../components/Loader/Loader";
import "./confirmEmail.scss";
import useScrollUpAndOpenLogin from "../../Hooks/useScrollUpAndOpenLogin";
import jwt_decode from "jwt-decode";

const ConfirmEmail = () => {
  const [emailConfirmationState, dispatchEmailConfirmation] = useReducer(
    EmailConfirmationReducer,
    {
      successConfirmed: false,
      alreadyConfirmed: false,
      msg: "",
    }
  );

  const history = useHistory();

  const user = JSON.parse(window.localStorage.getItem("user") || "{}");
  if (user && user.id) {
    history.push("/");
  }

  const { token } = useParams<{ token: string }>();
  let decodedToken: any;
  try {
    decodedToken = jwt_decode(token);
    console.log(decodedToken);
  } catch {
    dispatchEmailConfirmation({ type: "wrong" });
  }

  useEffect(() => {
    if (decodedToken) {
      Users.confirmEmail(decodedToken.nameid)
        .then(() => dispatchEmailConfirmation({ type: "confirmed" }))
        .catch((err: any) => {
          if (err.status === 400 && err.data.errors.email) {
            dispatchEmailConfirmation({
              type: "already confirmed",
              msg: err.data.errors.email,
            });
          } else {
            dispatchEmailConfirmation({ type: "wrong" });
          }
        });
    }
  }, [decodedToken]);

  const scrollUpAndOpenLogin = useScrollUpAndOpenLogin();

  return (
    <div className="confirmEmail">
      {emailConfirmationState?.successConfirmed ? (
        <div className="confirmEmail__success">
          <h1>{emailConfirmationState.msg}</h1>
          <h2>Now, please login</h2>
          <StandardButton onClick={scrollUpAndOpenLogin}>Login</StandardButton>
        </div>
      ) : (
        <div className="confirmEmail__fail">
          {emailConfirmationState?.msg ? (
            <div>
              <h1>{emailConfirmationState.msg}</h1>
              <h2>Please check your email again</h2>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      )}
    </div>
  );
};

interface EmailConfirmationState {
  successConfirmed: boolean;
  alreadyConfirmed: boolean;
  msg: string | undefined;
}

function EmailConfirmationReducer(
  state: EmailConfirmationState,
  action: { type: string; msg?: string }
) {
  if (action.type === "already confirmed") {
    return { successConfirmed: true, alreadyConfirmed: true, msg: action.msg };
  } else if (action.type === "confirmed") {
    return {
      successConfirmed: true,
      alreadyConfirmed: false,
      msg: "Your email is confirmed successfully!",
    };
  } else if (action.type === "wrong") {
    return {
      successConfirmed: false,
      alreadyConfirmed: false,
      msg: "Something went wrong",
    };
  } else {
    throw new Error("Invalid type");
  }
}

export default ConfirmEmail;
