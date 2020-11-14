import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Activities } from "../../api/axios";
import Loader from "../../components/Loader/Loader";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import CreateActivity from "../CreateActivity/CreateActivity";
import { ServerActivity } from "../../api/serverDataInterfaces";

import "./editActivity.scss";

const EditActivity = () => {
  const [loader, setLoader] = useState(true);
  const [activity, setActivity] = useState<ServerActivity | null>(null);

  const { userId, activityId } = useParams<{
    userId: string;
    activityId: string;
  }>();
  const history = useHistory();
  const errorHandler = useApiErrorHandler();

  const userHostId = JSON.parse(window.localStorage.getItem("user") || "{}")[
    "id"
  ];

  if (userHostId !== userId) {
    history.push("/unauthorized");
  }

  useEffect(() => {
    Activities.detail(activityId)
      .then((data: ServerActivity) => {
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
            activityId={activity.id}
          />
        </div>
      )}
    </>
  );
};

export default EditActivity;
