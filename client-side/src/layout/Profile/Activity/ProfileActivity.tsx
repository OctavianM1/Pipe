import React, { useEffect, useMemo, useState } from "react";
import "./p-activity.scss";
import { ServerUser } from "../../../api/serverDataInterfaces";
import WatchedActivitiesTemplate from "./WatchedActivitiesTemplate";
import useHashedState from "../../../Hooks/useHashedState";
import { Activities } from "../../../api/axios";

const ProfileActivity = ({ user }: { user: ServerUser }) => {
  const hashObj = useHashedState();
  const [itemIdx, setItemIdx] = useState(getWatch(hashObj));

  const headerString = useMemo(() => {
    if (itemIdx === 0) return "Liked Activities";
    else if (itemIdx === 1) return "Rated Activities";
    else return "Liked Comments";
  }, [itemIdx]);

  useEffect(() => {
    setItemIdx(getWatch(hashObj));
  }, [hashObj]);

  const fetchActivities = useMemo(() => {
    if (itemIdx === 0) {
      return Activities.likedActivities;
    } else if (itemIdx === 1) {
      return Activities.ratedActivities;
    } else {
      return Activities.likedComments;
    }
  }, [itemIdx]);

  return (
    <div className="p-activity">
      <WatchedActivitiesTemplate
        user={user}
        fetchActivities={fetchActivities}
        headerString={headerString}
      />
    </div>
  );
};

function getWatch(hashObj: { [key: string]: string }) {
  return hashObj["watch"] === "liked-comments"
    ? 2
    : hashObj["watch"] === "rated-activities"
    ? 1
    : 0;
}

export default ProfileActivity;
