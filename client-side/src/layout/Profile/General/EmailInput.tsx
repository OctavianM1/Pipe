import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import { Users } from "../../../api/axios";
import { ServerUser } from "../../../api/serverDataInterfaces";
import StandardButton from "../../../components/Buttons/StandardBtn/StandardButton";

const EmailInput = ({
  user,
  userData,
  setUserData,
}: {
  user: ServerUser;
  userData: ServerUser;
  setUserData: Dispatch<SetStateAction<ServerUser>>;
}) => {
  const [editEmail, setEditEmail] = useState(false);
  const [emailLoggoer, setEmailLogger] = useState("");

  const emailInput = useRef<HTMLInputElement>(null);

  const handleSubmitEmail = useCallback(
    (
      ev: FormEvent<HTMLFormElement> | null,
      obj?: { type: string; newName?: string; newEmail?: string }
    ) => {
      const evTarget = ev?.target as any;
      const newEmail = ev ? evTarget.email.value.trim() : obj?.newEmail;
      const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (re.test(newEmail)) {
        Users.updateEmail({ userId: user.id, newEmail })
          .then((newUser: ServerUser) => {
            setUserData(newUser);
            setEditEmail(false);
            window.localStorage.setItem(
              "user",
              JSON.stringify({ ...user, email: newEmail })
            );
          })
          .catch((err: any) => {
            if (err.status === 400 && err.data.errors.email) {
              setEmailLogger(err.data.errors.email);
            }
          });
      } else {
        setEmailLogger("Invalid email");
      }
    },
    [setUserData, user]
  );

  const handleEditEmail = (
    ev: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    const evTarget = ev.target as Element;
    if (evTarget.id === "cancelEditEmail") {
      setEditEmail(false);
    } else {
      setEditEmail(true);
      setTimeout(() => {
        emailInput.current && emailInput.current.focus();
      }, 40);
    }
  };

  return (
    <div
      className={
        editEmail
          ? "profile__container__public__el"
          : "profile__container__public__el editable"
      }
      onClick={handleEditEmail}
    >
      <div className="profile__container__public__el__label">Email</div>
      <div className="profile__container__public__el__info">
        {editEmail ? (
          <>
            <form onSubmit={handleSubmitEmail}>
              <input
                ref={emailInput}
                className="normal-input"
                name="email"
                defaultValue={userData.email}
              />
              <div className="profile__input-logger">{emailLoggoer}</div>
            </form>
            <div className="profile__submit-cancel-pair">
              <StandardButton
                onClick={() =>
                  handleSubmitEmail(null, {
                    newEmail: emailInput?.current?.value,
                    type: "email",
                  })
                }
                id="submitEmail"
                classNames={["profile__submit-btn"]}
              >
                Submit
              </StandardButton>
              <StandardButton
                classNames={["profile__cancel-btn"]}
                id="cancelEditEmail"
                onClick={handleEditEmail}
              >
                Cancel
              </StandardButton>
            </div>
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
  );
};

export default EmailInput;
