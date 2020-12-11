import React, { useEffect, useState } from "react";
import { Users } from "../../../api/axios";
import { ServerUser } from "../../../api/serverDataInterfaces";
import Loader from "../../../components/Loader/Loader";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import CoverPhoto from "./CoverPhoto";
import EditPassword from "./EditPassword";
import EmailInput from "./EmailInput";
import NameInput from "./NameInput";

const General = ({ user }: { user: ServerUser }) => {
  const [userData, setUserData] = useState<ServerUser>(null!);

  const error = useApiErrorHandler();

  useEffect(() => {
    if (user.id) {
      Users.details(user.id).then(setUserData).catch(error);
    }
  }, [error, user.id]);

  return (
    <>
      {userData ? (
        <div className="profile__container">
          <>
            <div className="profile__container__public">
              <h2 className="profile__container__info">Public information</h2>
              <CoverPhoto user={user} />
              <NameInput
                user={user}
                userData={userData}
                setUserData={setUserData}
              />
              <EmailInput
                user={user}
                userData={userData}
                setUserData={setUserData}
              />
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
                <div className="profile__container__public__el__label">
                  Follows
                </div>
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
              <EditPassword user={user} setUserData={setUserData} />
            </div>
          </>
        </div>
      ) : (
        <div className="profile__loader">
          <Loader />
        </div>
      )}
    </>
  );
};

export default General;
