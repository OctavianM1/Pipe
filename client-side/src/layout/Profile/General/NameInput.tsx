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
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";

const NameInput = ({
  user,
  userData,
  setUserData,
}: {
  user: ServerUser;
  userData: ServerUser;
  setUserData: Dispatch<SetStateAction<ServerUser>>;
}) => {
  const [editName, setEditName] = useState(false);
  const [nameLoggoer, setNameLogger] = useState("");

  const nameInput = useRef<HTMLInputElement>(null);

  const error = useApiErrorHandler();

  const handleSubmitName = useCallback(
    (
      ev: FormEvent<HTMLFormElement> | null,
      obj?: { type: string; newName?: string; newEmail?: string }
    ) => {
      ev?.preventDefault();
      const evTarget = ev?.target as any;
      const newName = ev ? evTarget.name.value.trim() : obj?.newName;
      if (newName === userData.name) {
        setEditName(false);
        return;
      }
      if (newName.length > 1) {
        Users.updateName({ userId: user.id, newName })
          .then((newUser: ServerUser) => {
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
    },
    [error, user, setUserData, userData.name]
  );

  const handleEditName = (
    ev: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    const evTarget = ev.target as Element;
    if (evTarget.id === "cancelEditName") {
      setEditName(false);
    } else {
      setEditName(true);
      setTimeout(() => {
        nameInput.current && nameInput.current.focus();
      }, 40);
    }
  };

  return (
    <div
      className={
        editName
          ? "profile__container__public__el"
          : "profile__container__public__el editable"
      }
      onClick={handleEditName}
    >
      <div className="profile__container__public__el__label">Name</div>
      <div className="profile__container__public__el__info">
        {editName ? (
          <>
            <form onSubmit={(ev) => handleSubmitName(ev)}>
              <input
                ref={nameInput}
                className="normal-input"
                name="name"
                defaultValue={userData.name}
                autoComplete="off"
              />
              <div className="profile__input-logger">{nameLoggoer}</div>
            </form>
            <div className="profile__submit-cancel-pair">
              <StandardButton
                id="submitName"
                onClick={() =>
                  handleSubmitName(null, {
                    newName: nameInput?.current?.value,
                    type: "name",
                  })
                }
                classNames={["profile__submit-btn"]}
              >
                Submit
              </StandardButton>
              <StandardButton
                classNames={["profile__cancel-btn"]}
                id="cancelEditName"
                onClick={handleEditName}
              >
                Cancel
              </StandardButton>
            </div>
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
  );
};

export default NameInput;
