import React, { useEffect, useRef, useState } from "react";

import "./profile.scss";

import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";

import { Users } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";

const Profile = () => {
  const [editName, setEditName] = useState(false);
  const [nameLoggoer, setNameLogger] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [emailLoggoer, setEmailLogger] = useState("");
  const [editPassword, setEditPassword] = useState(false);
  const [oldPasswordLogger, setOldPasswordLogger] = useState("");
  const [newPasswordLogger, setNewPasswordLogger] = useState("");
  const [confirmNewPasswordLogger, setConfirmNewPasswordLogger] = useState("");
  const [userData, setUserData] = useState({});

  const nameInput = useRef(null);
  const emailInput = useRef(null);

  const user = JSON.parse(window.localStorage.getItem("user"));

  const error = useApiErrorHandler();

  useEffect(() => {
    Users.details(user.id).then(setUserData).catch(error);
  }, [error, user]);

  const handleSubmit = (ev, obj) => {
    ev && ev.preventDefault();
    const target = ev ? ev.target.firstChild.name : obj.type;
    if (target === "name") {
      const newName = ev ? ev.target.name.value.trim() : obj.newName;
      if (newName === userData.name) {
        setEditName(false);
        return;
      }
      if (newName.length > 1) {
        Users.updateName({ userId: user.id, newName })
          .then((newUser) => {
            setUserData(newUser);
            setEditName(false);
            window.localStorage.setItem(
              "user",
              JSON.stringify({
                ...user,
                name: newName,
              })
            );
          })
          .catch(error);
      } else {
        setNameLogger("Name must be at least 2 characters");
      }
    } else if (target === "email") {
      const newEmail = ev ? ev.target.email.value.trim() : obj.newEmail;
      const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (re.test(newEmail)) {
        Users.updateEmail({ userId: user.id, newEmail })
          .then((newUser) => {
            setUserData(newUser);
            setEditEmail(false);
            window.localStorage.setItem(
              "user",
              JSON.stringify({ ...user, email: newEmail })
            );
          })
          .catch((err) => {
            if (err.status === 400 && err.data.errors.email) {
              setEmailLogger(err.data.errors.email);
            }
          });
      } else {
        setEmailLogger("Invalid email");
      }
    } else if (ev && ev.target.id === "changePassword") {
      const oldPassword = ev.target.oldPassword.value.trim();
      const newPassword = ev.target.newPassword.value.trim();
      const confirmNewPassword = ev.target.confirmNewPassword.value.trim();
      if (
        newPasswordLogger === "" &&
        confirmNewPasswordLogger === "" &&
        oldPasswordLogger === "" &&
        confirmNewPassword.length > 0
      ) {
        Users.updatePassword({ userId: user.id, newPassword, oldPassword })
          .then((user) => {
            setUserData(user);
            setEditPassword(false);
          })
          .catch((err) => {
            if (err.status === 400 && err.data.errors.password) {
              setOldPasswordLogger(err.data.errors.password);
            }
          });
      }
    }
  };

  const handleBlurPassword = (ev) => {
    const form = ev && ev.target.parentElement.parentElement;
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
  };

  const toggleShowPassword = (ev) => {
    const input = ev.target.parentElement.firstChild;
    input.type = input.type === "password" ? "text" : "password";
  };

  const handleEdit = (ev, type) => {
    if (type === "name") {
      if (ev.target.id === "cancelEditName") {
        setEditName(false);
      } else {
        setEditName(true);
        setTimeout(() => {
          nameInput.current && nameInput.current.focus();
        }, 40);
      }
    } else if (type === "email") {
      if (ev.target.id === "cancelEditEmail") {
        setEditEmail(false);
      } else {
        setEditEmail(true);
        setTimeout(() => {
          emailInput.current && emailInput.current.focus();
        }, 40);
      }
    }
  };

  useOutsideAlerter(nameInput, setEditName, "profile__cancel-btn", () => {
    handleSubmit(null, { newName: nameInput.current.value, type: "name" });
  });
  useOutsideAlerter(emailInput, setEditEmail, "profile__cancel-btn", () => {
    handleSubmit(null, { newEmail: emailInput.current.value, type: "email" });
  });

  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__container__public">
          <h2 className="profile__container__info">Public information</h2>
          <div
            className={
              editName
                ? "profile__container__public__el"
                : "profile__container__public__el editable"
            }
            onClick={(ev) => handleEdit(ev, "name")}
          >
            <div className="profile__container__public__el__label">Name</div>
            <div className="profile__container__public__el__info">
              {editName ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <input
                      ref={nameInput}
                      className="normal-input"
                      name="name"
                      defaultValue={userData.name}
                      autoComplete="off"
                    />
                    <div className="profile__input-logger">{nameLoggoer}</div>
                  </form>
                  <button
                    className="profile__cancel-btn"
                    id="cancelEditName"
                    onClick={(ev) => handleEdit(ev, "name")}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="profile__container__public__el__info__data">
                    {userData.name}
                  </div>
                  <div className="profile__container__public__el__info__edit">
                    <img src="/images/profile/draw.svg" alt="edit" />
                    Edit
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className={
              editEmail
                ? "profile__container__public__el"
                : "profile__container__public__el editable"
            }
            onClick={(ev) => handleEdit(ev, "email")}
          >
            <div className="profile__container__public__el__label">Email</div>
            <div className="profile__container__public__el__info">
              {editEmail ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <input
                      ref={emailInput}
                      className="normal-input"
                      name="email"
                      defaultValue={userData.email}
                    />
                    <div className="profile__input-logger">{emailLoggoer}</div>
                  </form>
                  <button
                    className="profile__cancel-btn"
                    id="cancelEditEmail"
                    onClick={(ev) => handleEdit(ev, "email")}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="profile__container__public__el__info__data">
                    {userData.email}
                  </div>
                  <div className="profile__container__public__el__info__edit">
                    <img src="/images/profile/draw.svg" alt="edit" />
                    Edit
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="profile__container__public__el">
            <div className="profile__container__public__el__label">
              Following
            </div>
            <div className="profile__container__public__el__info">
              <div className="profile__container__public__el__info__data">
                {userData.countFollowing}
              </div>
            </div>
          </div>
          <div className="profile__container__public__el">
            <div className="profile__container__public__el__label">Follows</div>
            <div className="profile__container__public__el__info">
              <div className="profile__container__public__el__info__data">
                {userData.countFollowers}
              </div>
            </div>
          </div>
          <div className="profile__container__public__el">
            <div className="profile__container__public__el__label">
              Activities
            </div>
            <div className="profile__container__public__el__info">
              <div className="profile__container__public__el__info__data">
                {userData.numberOfActivities}
              </div>
            </div>
          </div>
        </div>

        <div className="profile__container__security">
          <h2 className="profile__container__info">Security information</h2>
          <div
            className={
              editPassword
                ? "profile__container__security__el"
                : "profile__container__security__el editable"
            }
            onClick={(ev) =>
              ev.target.classList.contains("profile__cancel-btn")
                ? setEditPassword(false)
                : setEditPassword(true)
            }
          >
            {editPassword ? (
              <form
                className="change-password-form"
                onSubmit={handleSubmit}
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
                  onClick={(ev) =>
                    ev.target.classList.contains("profile__cancel-btn")
                      ? setEditPassword(false)
                      : setEditPassword(true)
                  }
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
