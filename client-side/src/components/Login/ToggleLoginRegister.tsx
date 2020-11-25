import React, { Dispatch, SetStateAction } from "react";

const ToggleLoginRegister = ({
  setSignUp,
}: {
  setSignUp: Dispatch<SetStateAction<boolean>>;
}) => {
  
  return (
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
  );
};

export default React.memo(ToggleLoginRegister);
