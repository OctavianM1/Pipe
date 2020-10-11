import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterSide from "../../components/FilterSide/FilterSide";

import "./myactivities.scss";

import { Activities } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import Activity from "./Activity";

const MyActivities = () => {
  const errorHandler = useApiErrorHandler();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    Activities.list(JSON.parse(window.localStorage.getItem("user"))["id"])
      .then(setActivities)
      .catch(errorHandler);
  }, [errorHandler]);

  console.log(activities);


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
          {
            activities.map((activity) => (
              <Activity
                key={activity.id}
                title={activity.title}
                body={activity.body}
                subject={activity.subject}
                date={activity.date}
              />
            ))
          }
          <div className="my-activities__activities-side__activity">
            activity2
          </div>
        </div>
      </div>
    </>
  );
};

export default MyActivities;
