import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Activities } from "../../api/axios";
import Loader from "../../components/Loader/Loader";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import CreateActivity from "../CreateActivity/CreateActivity";

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

  useEffect(() => {
    Activities.detail(activityId)
      .then((data) => {
        setLoader(false);
        setActivity(data);
      })
      .catch(errorHandler);
  }, [userId, activityId, errorHandler]);

  return (
    <>
      {loader && (
        <div className="edit__loader">
          <Loader />
        </div>
      )}
      {activity && (
        <div className="edit">
          <CreateActivity
            edit={true}
            title={activity.title}
            body={activity.body}
            subject={activity.subject}
            activity={activity}
          />
        </div>
      )}
    </>
  );
};

export default EditActivity;
