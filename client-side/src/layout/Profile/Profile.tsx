import React, { useEffect, useState } from "react";
import "./profile.scss";
import { Users } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import { ServerUser } from "../../api/serverDataInterfaces";
import CoverPhoto from "./CoverPhoto";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import EditPassword from "./EditPassword";
import Loader from "../../components/Loader/Loader";
import useDocumentTitle from "../../Hooks/useDocumentTitle";

const Profile = () => {
  const [userData, setUserData] = useState<ServerUser>(null!);

  const error = useApiErrorHandler();

  const user: ServerUser = JSON.parse(
    window.localStorage.getItem("user") || "{}"
  );

  useDocumentTitle(`${user.name} profile`, [user.name]);

  useEffect(() => {
    Users.details(user.id).then(setUserData).catch(error);
  }, [error, user.id]);

  return (
    <div className="profile">
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
    </div>
  );
};

export default Profile;
