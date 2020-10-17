import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FilterSide from "../../components/FilterSide/FilterSide";

import "./userActivities.scss";

import { Activities } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import useHavePutLike from "../../Hooks/useHavePutLike";
import useHavePutRate from "../../Hooks/useHavePutRate";
import Activity from "./Activity";
import useHash from "../../Hooks/useHash";
import Loader from "../../components/Loader/Loader";

const MyActivities = () => {
  const { userId: hostUserId } = useParams();
  const visitorUserId = JSON.parse(window.localStorage.getItem("user"))["id"];

  const errorHandler = useApiErrorHandler();
  const [activities, setActivities] = useState([]);
  const [displayedActivities, setDisplayedActivities] = useState([]);

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    Activities.list(hostUserId)
      .then((activs) => {
        setActivities(activs);
        setDisplayedActivities(activs);
        setLoader(false);
      })
      .catch(errorHandler);
  }, [errorHandler, hostUserId]);

  const hashObj = useHash();

  const havePutLike = useHavePutLike();
  const havePutRate = useHavePutRate();

  const handleRemoveActivity = (activityId) => {
    Activities.delete(activityId)
      .then(() => {
        const newActivities = activities.filter((a) => a.id !== activityId);
        setActivities(newActivities);
      })
      .catch((err) => console.log(err));
  };

  const sortActivitiesByRaiting = useCallback(() => {
    if (hashObj["raiting-stars"]) {
      const displayedActivities = [];
      const raitingStars = +hashObj["raiting-stars"];
      for (let i = 0; i < activities.length; i++) {
        if (activities[i].raiting.raiting >= raitingStars) {
          displayedActivities.push(activities[i]);
        }
      }
      if (hashObj["raiting-ascending"] === "true") {
        const sortedActivities = displayedActivities.sort(
          (a, b) => a.raiting.raiting - b.raiting.raiting
        );
        setDisplayedActivities(sortedActivities);
      } else if (hashObj["raiting-descending"] === "true") {
        const sortedActivities = displayedActivities.sort(
          (a, b) => b.raiting.raiting - a.raiting.raiting
        );
        console.log(sortedActivities);
        setDisplayedActivities(sortedActivities);
      } else {
        setDisplayedActivities(displayedActivities);
      }
    } else if (hashObj["raiting-ascending"] === "true") {
      const newActivities = [...activities].sort(
        (a, b) => a.raiting.raiting - b.raiting.raiting
      );
      setDisplayedActivities(newActivities);
    } else if (hashObj["raiting-descending"] === "true") {
      const newActivities = [...activities].sort(
        (a, b) => b.raiting.raiting - a.raiting.raiting
      );
      setDisplayedActivities(newActivities);
    } else {
      setDisplayedActivities([...activities]);
    }
  }, [hashObj, activities]);

  useEffect(() => {
    sortActivitiesByRaiting();
  }, [sortActivitiesByRaiting]);

  const sortActivitiesByDate = useCallback(() => {
    if (hashObj["date-ascending"] === "true") {
      console.log(activities);
      const newActivities = [...activities].sort((a, b) =>
        sortDateOldest(a, b)
      );
      setDisplayedActivities(newActivities);
    } else if (hashObj["date-descending"] === "true") {
      const newActivities = [...activities].sort((a, b) =>
        sortDateNewest(a, b)
      );
      setDisplayedActivities(newActivities);
    }
  }, [hashObj, activities]);

  useEffect(() => {
    sortActivitiesByDate();
  }, [sortActivitiesByDate]);

  const filterBySubject = useCallback(() => {
    if (!hashObj["art"] && !hashObj["sport"]) {
      return;
    }
    const newActivities = [];
    if (hashObj["art"] === "true") {
      for (let i = 0; i < activities.length; i++) {
        if (activities[i].subject.toLowerCase().includes("art")) {
          newActivities.push(activities[i]);
        }
      }
    }
    if (hashObj["sport"] === "true") {
      for (let i = 0; i < activities.length; i++) {
        if (activities[i].subject.toLowerCase().includes("sport")) {
          newActivities.push(activities[i]);
        }
      }
    }
    if (newActivities.length === activities.length) {
      let same = true;
      for (let i = 0; i < activities.length; i++) {
        if (activities[i].id !== newActivities[i].id) {
          same = false;
          break;
        }
      }
      if (!same) {
        setDisplayedActivities(newActivities);
      }
    } else {
      setDisplayedActivities(newActivities);
    }
  }, [hashObj, activities]);

  useEffect(() => {
    filterBySubject();
  }, [filterBySubject]);

  return (
    <>
      <Link to="/add-activity" className="add-activity">
        <img src="/images/activities/plus.svg" alt="plus" />
      </Link>
      <div className="my-activities">
        {loader ? (
          <div className="my-activities__loader">
            <Loader />
          </div>
        ) : (
          <>
            <div className="my-activities__filter-side">
              <FilterSide />
            </div>
            <div className="my-activities__activities-side">
              {displayedActivities.map((activity) => (
                <Activity
                  key={activity.id}
                  id={activity.id}
                  title={activity.title}
                  body={activity.body}
                  subject={activity.subject}
                  onRemove={() => handleRemoveActivity(activity.id)}
                  date={activity.dateTimeCreated}
                  totalRaiting={activity.raiting}
                  isLiked={() =>
                    havePutLike(activity.likes.users, visitorUserId)
                  }
                  likesNumber={activity.likes.likes}
                  personalRate={() =>
                    havePutRate(activity.raiting.users, visitorUserId)
                  }
                  hostUserId={hostUserId}
                  visitorUserId={visitorUserId}
                  comments={activity.comments}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

function sortDateOldest(a, b) {
  const yearA = getYear(a.dateTimeCreated);
  const yearB = getYear(b.dateTimeCreated);
  if (yearA !== yearB) {
    return yearA - yearB;
  }
  const monthA = getMonth(a.dateTimeCreated);
  const monthB = getMonth(b.dateTimeCreated);
  if (monthA !== monthB) {
    return monthA - monthB;
  }
  const dayA = getDay(a.dateTimeCreated);
  const dayB = getDay(b.dateTimeCreated);
  if (dayA !== dayB) {
    return dayA - dayB;
  }
  const hourA = getHours(a.dateTimeCreated);
  const hourB = getHours(b.dateTimeCreated);
  if (hourA !== hourB) {
    return hourA - hourB;
  }
  const minutesA = getMinutes(a.dateTimeCreated);
  const minutesB = getMinutes(b.dateTimeCreated);
  return minutesA - minutesB;
}

function sortDateNewest(a, b) {
  const yearA = getYear(a.dateTimeCreated);
  const yearB = getYear(b.dateTimeCreated);
  if (yearA !== yearB) {
    return yearB - yearA;
  }
  const monthA = getMonth(a.dateTimeCreated);
  const monthB = getMonth(b.dateTimeCreated);
  if (monthA !== monthB) {
    return monthB - monthA;
  }
  const dayA = getDay(a.dateTimeCreated);
  const dayB = getDay(b.dateTimeCreated);
  if (dayA !== dayB) {
    return dayB - dayA;
  }
  const hourA = getHours(a.dateTimeCreated);
  const hourB = getHours(b.dateTimeCreated);
  if (hourA !== hourB) {
    return hourB - hourA;
  }
  const minutesA = getMinutes(a.dateTimeCreated);
  const minutesB = getMinutes(b.dateTimeCreated);
  return minutesB - minutesA;
}

export default MyActivities;

function getYear(date) {
  return +date.substring(6, 10);
}

function getMonth(date) {
  return +date.substring(3, 5);
}

function getDay(date) {
  return +date.substring(0, 2);
}

function getHours(date) {
  return +date.substring(11, 13);
}

function getMinutes(date) {
  return +date.substring(14, 16);
}
