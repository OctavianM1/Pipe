import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Users } from "../../api/axios";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import Loader from "../../components/Loader/Loader";

import "./confirmEmail.scss";
import useScrollUpAndOpenLogin from "../../Hooks/useScrollUpAndOpenLogin";

const ConfirmEmail = () => {
  const [emailConfirmationState, dispatchEmailConfirmation] = useReducer(
    EmailConfirmationReducer,
    {
      successConfirmed: false,
      alreadyConfirmed: false,
      msg: "",
    }
  );

  const { token } = useParams();

  let decodedToken;
  try {
    decodedToken = jwt_decode(token);
  } catch {
    dispatchEmailConfirmation({ type: "wrong" });
  }

  useEffect(() => {
    if (decodedToken) {
      Users.confirmEmail(decodedToken.nameid)
        .then(() => dispatchEmailConfirmation({ type: "confirmed" }))
        .catch((err) => {
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
      {emailConfirmationState.successConfirmed ? (
        <div className="confirmEmail__success">
          <h1>{emailConfirmationState.msg}</h1>
          <h2>Now, please login</h2>
          <StandardButton onClick={scrollUpAndOpenLogin}>Login</StandardButton>
        </div>
      ) : (
        <div className="confirmEmail__fail">
          {emailConfirmationState.msg ? (
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

function EmailConfirmationReducer(state, action) {
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
  }
}

export default ConfirmEmail;
