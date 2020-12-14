import React, { useEffect, useState } from "react";
import { Users } from "../../../api/axios";
import { ServerUser } from "../../../api/serverDataInterfaces";
import Loader from "../../../components/Loader/Loader";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import CoverPhoto from "./CoverPhoto";
import EditPassword from "./EditPassword";
import EmailInput from "./EmailInput";
import EmailSubscribe from "./EmailSubscribe";
import NameInput from "./NameInput";
import StatelessProfileItem from "./StatelessProfileItem";

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
              <StatelessProfileItem
                label="Following"
                data={userData.countFollowing}
              />
              <StatelessProfileItem
                label="Follows"
                data={userData.countFollowers}
              />
              <StatelessProfileItem
                label="Activities"
                data={userData.numberOfActivities}
              />
              <EmailSubscribe userData={userData} setUserData={setUserData} />
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
