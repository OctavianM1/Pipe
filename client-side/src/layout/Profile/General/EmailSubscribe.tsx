import React, { Dispatch, SetStateAction, useState } from "react";
import { Users } from "../../../api/axios";
import { ServerUser } from "../../../api/serverDataInterfaces";
import StandardButton from "../../../components/Buttons/StandardBtn/StandardButton";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";

const EmailSubscribe = ({
  userData,
  setUserData,
}: {
  userData: ServerUser;
  setUserData: Dispatch<SetStateAction<ServerUser>>;
}) => {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const error = useApiErrorHandler();

  const submitSubscribeToEmails = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!isSubscribing) {
      setIsSubscribing(true);
      if (userData.isSubscribedToEmails) {
        Users.unSubscribeToSendEmails({ email: userData.email })
          .then(() => {
            window.localStorage.setItem("subscribeToEmail", "{}");
            setUserData((user) => ({ ...user, isSubscribedToEmails: false }));
            setIsSubscribing(false);
          })
          .catch(error);
      } else {
        Users.subscribeToSendEmails({ email: userData.email })
          .then(() => {
            window.localStorage.setItem(
              "subscribeToEmail",
              JSON.stringify({ email: userData.email })
            );
            setUserData((user) => ({ ...user, isSubscribedToEmails: true }));
            setIsSubscribing(false);
          })
          .catch(error);
      }
    }
  };

  return (
    <div className="profile__container__public__el">
      <div className="profile__container__public__el__label">Email News</div>
      <div className="profile__container__public__el__info">
        <div className="profile__container__public__el__info__data">
          <form onSubmit={submitSubscribeToEmails}>
            {userData.isSubscribedToEmails ? (
              <StandardButton
                classNames={
                  isSubscribing
                    ? ["profile__cancel-btn", "standard-btn__isSubmiting"]
                    : ["profile__cancel-btn"]
                }
              >
                Cancel
              </StandardButton>
            ) : (
              <StandardButton
                type="submit"
                id="submitCoverImage"
                classNames={
                  isSubscribing
                    ? ["profile__submit-btn", "standard-btn__isSubmiting"]
                    : ["profile__submit-btn"]
                }
              >
                Subscribe
              </StandardButton>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailSubscribe;
