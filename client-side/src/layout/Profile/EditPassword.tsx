import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
  FocusEvent,
  useRef,
} from "react";
import { Users } from "../../api/axios";
import { ServerUser } from "../../api/serverDataInterfaces";
import CloseBtn from "../../components/Buttons/CloseBtn/CloseBtn";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import useDisableScroll from "../../Hooks/useDisableScroll";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";

const EditPassword = ({
  user,
  setUserData,
}: {
  user: ServerUser;
  setUserData: Dispatch<SetStateAction<ServerUser>>;
}) => {
  const [editPassword, setEditPassword] = useState(false);
  const [oldPasswordLogger, setOldPasswordLogger] = useState("");
  const [newPasswordLogger, setNewPasswordLogger] = useState("");
  const [confirmNewPasswordLogger, setConfirmNewPasswordLogger] = useState("");
  const [popUpSuccessChangePass, setPopUpSuccessChangePass] = useState(false);

  const popUpSuccessChangePassRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(popUpSuccessChangePassRef, setPopUpSuccessChangePass);

  if (popUpSuccessChangePass) {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  useDisableScroll([popUpSuccessChangePass]);

  const handleSubmitChangePassword = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const evTarget = ev.target as any;
      const oldPassword = evTarget.oldPassword.value.trim();
      const newPassword = evTarget.newPassword.value.trim();
      const confirmNewPassword = evTarget.confirmNewPassword.value.trim();
      if (
        newPasswordLogger === "" &&
        confirmNewPasswordLogger === "" &&
        oldPasswordLogger === "" &&
        confirmNewPassword.length > 0
      ) {
        Users.updatePassword({ userId: user.id, newPassword, oldPassword })
          .then((user: ServerUser) => {
            setUserData(user);
            setEditPassword(false);
            setPopUpSuccessChangePass(true);
          })
          .catch((err: any) => {
            if (err.status === 400 && err.data.errors.password) {
              setOldPasswordLogger(err.data.errors.password);
            }
          });
      }
    },
    [
      confirmNewPasswordLogger,
      newPasswordLogger,
      oldPasswordLogger,
      setUserData,
      user.id,
    ]
  );

  const handleBlurPassword = useCallback((ev: FocusEvent<HTMLInputElement>) => {
    const evTarget = ev.target as any;
    const form = ev && evTarget.parentElement.parentElement;
    const newPassword = form.newPassword.value.trim();
    const confirmNewPassword = form.confirmNewPassword.value.trim();
    if (newPassword !== confirmNewPassword && confirmNewPassword.length > 0) {
      setConfirmNewPasswordLogger("Password doesn't match");
    } else {
      setConfirmNewPasswordLogger("");
    }
    let log = [];
    if (newPassword.length < 8) {
      log.push("8 charachters");
    }
    if (!/[a-zA-Z]+/g.test(newPassword)) {
      log.push("a lowercase character or a uppercase character");
    }
    if (!/[\d\W]/g.test(newPassword)) {
      log.push("a digit or a non alphanumeric charachter");
    }
    if (log.length !== 0 && log.length !== 3) {
      // log.length !== 3 -> 3 tests
      setNewPasswordLogger("Your password must contain " + log.join(", "));
    } else {
      setNewPasswordLogger("");
    }
  }, []);

  const toggleShowPassword = (
    ev: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    const input = evTarget.parentElement.firstChild;
    input.type = input.type === "password" ? "text" : "password";
  };

  const handleSetEditPassword = (
    ev: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    evTarget.classList.contains("profile__cancel-btn")
      ? setEditPassword(false)
      : setEditPassword(true);
  };

  return (
    <>
      {popUpSuccessChangePass && (
        <div className="profile__success-changed-password">
          <div
            ref={popUpSuccessChangePassRef}
            className="profile__success-changed-password__container"
          >
            <h1>You have changed password successfully!</h1>
            <CloseBtn onClick={() => setPopUpSuccessChangePass(false)} />
          </div>
        </div>
      )}
      <div
        className={
          editPassword
            ? "profile__container__security__el"
            : "profile__container__security__el editable"
        }
        onClick={handleSetEditPassword}
      >
        {editPassword ? (
          <form
            className="change-password-form"
            onSubmit={handleSubmitChangePassword}
            id="changePassword"
          >
            <div className="change-password-form__input-container">
              <input
                className="normal-input margin-1rem-tb"
                name="oldPassword"
                placeholder="Old password"
                type="password"
              />
              <input
                type="checkbox"
                name="oldPasswordCheckbox"
                id="oldPasswordCheckbox"
                onClick={toggleShowPassword}
              />
              <label htmlFor="oldPasswordCheckbox">Show</label>
            </div>
            <div className="profile__input-logger">{oldPasswordLogger}</div>
            <div className="change-password-form__input-container">
              <input
                className="normal-input margin-1rem-tb"
                name="newPassword"
                placeholder="New password"
                onBlur={handleBlurPassword}
                type="password"
              />
              <input
                type="checkbox"
                name="newPasswordCheckbox"
                id="newPasswordCheckbox"
                onClick={toggleShowPassword}
              />
              <label htmlFor="newPasswordCheckbox">Show</label>
            </div>
            <div className="profile__input-logger">{newPasswordLogger}</div>
            <div className="change-password-form__input-container">
              <input
                className="normal-input margin-1rem-tb"
                name="confirmNewPassword"
                placeholder="Confirm new password"
                onBlur={handleBlurPassword}
                type="password"
              />
              <input
                type="checkbox"
                name="confirmNewPasswordCheckbox"
                id="confirmNewPasswordCheckbox"
                onClick={toggleShowPassword}
              />
              <label htmlFor="confirmNewPasswordCheckbox">Show</label>
            </div>

            <div className="profile__input-logger">
              {confirmNewPasswordLogger}
            </div>
            <StandardButton type="submit">Submit</StandardButton>
            <StandardButton
              classNames={["profile__cancel-btn"]}
              onClick={handleSetEditPassword}
            >
              Cancel
            </StandardButton>
          </form>
        ) : (
          <>
            <div className="profile__container__security__el__data">
              Change password
            </div>
            <div className="profile__container__security__el__edit">
              <img src="/images/profile/draw.svg" alt="edit" />
              Edit
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditPassword;
