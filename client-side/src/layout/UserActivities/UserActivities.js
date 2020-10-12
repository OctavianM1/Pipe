import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FilterSide from "../../components/FilterSide/FilterSide";

import "./userActivities.scss";

import { Activities } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import Activity from "./Activity";

const MyActivities = () => {
  const { userId: hostUserId } = useParams();
  const visitorUserId = JSON.parse(window.localStorage.getItem("user"))["id"];

  const errorHandler = useApiErrorHandler();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    Activities.list(hostUserId).then(setActivities).catch(errorHandler);
  }, [errorHandler, hostUserId]);

  console.log(activities);
  const havePutLike = (users) => {
    if (!users) {
      return false;
    }
    let putLike = false;
    users.forEach((u) => {
      if (u.id === visitorUserId) {
        putLike = true;
      }
    });
    return putLike;
  };

  const handlePutRate = (users) => {
    if (!users) {
      return 0;
    }
    let rate = 0;
    users.forEach((u) => {
      if (u.id === visitorUserId) {
        rate = u.rate;
      }
    });
    return rate;
  };

  const handleRemoveActivity = (activityId) => {
    Activities.delete(activityId)
      .then(() => {
        const newActivities = activities.filter((a) => a.id !== activityId);
        setActivities(newActivities);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Link to="/add-activity" className="add-activity">
        <img src="/images/activities/plus.svg" alt="plus" />
      </Link>
      <div className="my-activities">
        <div className="my-activities__filter-side">
          <FilterSide />
        </div>
        <div className="my-activities__activities-side">
          {activities.map((activity) => (
            <Activity
              key={activity.id}
              id={activity.id}
              title={activity.title}
              body={activity.body}
              subject={activity.subject}
              onRemove={() => handleRemoveActivity(activity.id)}
              date={`${activity.dateTimeCreated.split(".")[0].split("T")[0]} ${
                activity.dateTimeCreated.split(".")[0].split("T")[1]
              }`}
              totalRaiting={activity.raiting}
              isLiked={() => havePutLike(activity.likes.users)}
              likesNumber={activity.likes.likes}
              personalRate={() => handlePutRate(activity.raiting.users)}
              hostUserId={hostUserId}
              visitorUserId={visitorUserId}
              comments={activity.comments}
            />
          ))}
          <div className="my-activities__activities-side__activity">
            activity2
          </div>
        </div>
      </div>
    </>
  );
};

export default MyActivities;
