import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Activities } from "../../api/axios";
import Loader from "../../components/Loader/Loader";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import useHavePutLike from "../../Hooks/useHavePutLike";
import useHavePutRate from "../../Hooks/useHavePutRate";
import Activity from "./Activity";

import "./editActivity.scss";

const EditActivity = () => {
  const [loader, setLoader] = useState(true);
  const [activity, setActivity] = useState(null);

  const { userId, activityId } = useParams();
  const history = useHistory();
  const errorHandler = useApiErrorHandler();

  const userHostId = JSON.parse(window.localStorage.getItem("user"))["id"];

  if (userHostId !== userId) {
    history.push("/unauthorized");
  }

  const havePutLike = useHavePutLike();
  const havePutRate = useHavePutRate();

  useEffect(() => {
    Activities.detail(userId, activityId)
      .then((data) => {
        setLoader(false);
        setActivity(data);
        console.log(data);
      })
      .catch(errorHandler);
  }, [userId, activityId, errorHandler]);

  const handleRemoveActivity = () => {
    Activities.delete(activity.id)
      .then(() => {
        history.push(`/activities/${userHostId}`);
      })
      .catch(errorHandler);
  };

  console.log(activity);
  return (
    <>
      {loader && (
        <div className="edit__loader">
          <Loader />
        </div>
      )}
      {activity && (
        <div className='edit'>
          <Activity
            id={activity.id}
            title={activity.title}
            subject={activity.subject}
            body={activity.body}
            date={activity.date}
            isLiked={() => havePutLike(activity.likes.users, userHostId)}
            likesNumber={activity.likes.likes}
            totalRaiting={activity.raiting}
            personalRate={() => havePutRate(activity.raiting.users, userHostId)}
            hostUserId={userHostId}
            visitorUserId={userHostId}
            onRemove={handleRemoveActivity}
            comments={activity.comments}
            edit={true}
          />
        </div>
      )}
    </>
  );
};

export default EditActivity;
