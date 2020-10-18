import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FilterSide from "../../components/FilterSide/FilterSide";

import "./userActivities.scss";

import { Activities } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import useHavePutLike from "../../Hooks/useHavePutLike";
import useHavePutRate from "../../Hooks/useHavePutRate";
import Activity from "./Activity";
import useHash from "../../Hooks/useHash";
import Loader from "../../components/Loader/Loader";
import useReplaceHash from "../../Hooks/useReplaceHash";
import { useMemo } from "react";

const MyActivities = () => {
  const { userId: hostUserId } = useParams();
  const visitorUserId = JSON.parse(window.localStorage.getItem("user"))["id"];

  const errorHandler = useApiErrorHandler();
  const [activities, setActivities] = useState([]);

  const [loader, setLoader] = useState(true);

  const { hash } = useLocation();
  const replaceHash = useReplaceHash();
  const hashObj = useHash();

  const page = Number(hashObj["p"]) || 1;

  const sortedActivities = useMemo(() => {
    return sortActivities(activities, hashObj);
  }, [activities, hashObj]);

  const nrOfPages = Math.ceil(sortedActivities.length / 5);

  const activitiesOnCurrentPage = useMemo(() => {
    const result = [];
    for (let i = (page - 1) * 5; i < 5 * page && sortedActivities[i]; i++) {
      result.push(sortedActivities[i]);
    }
    return result;
  }, [page, sortedActivities]);

  useEffect(() => {
    Activities.list(hostUserId)
      .then((activs) => {
        setActivities(activs);
        setLoader(false);
      })
      .catch(errorHandler);
  }, [errorHandler, hostUserId]);

  const havePutLike = useHavePutLike();
  const havePutRate = useHavePutRate();

  const handleRemoveActivity = (activityId) => {
    Activities.delete(activityId)
      .then(() => {
        const newActivities = activities.filter((a) => a.id !== activityId);
        setActivities(newActivities);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePage = (page) => {
    window.scroll({ top: 0 });
    replaceHash(hash, `&p=${hashObj["p"]}`, `&p=${page}`);
  };

  const paginationNumbers = [];
  for (let i = 1; i <= nrOfPages; i++) {
    paginationNumbers.push(
      <button
        key={i}
        className={
          i === page
            ? "my-activities__pagination__page my-activities__pagination__page__current"
            : "my-activities__pagination__page"
        }
        onClick={() => handleChangePage(i)}
      >
        <h3>{i}</h3>
      </button>
    );
  }

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
              {activitiesOnCurrentPage.map((activity) => (
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
              <div className="my-activities__pagination">
                {paginationNumbers}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

function filterSubject(activities, hashObj) {
  if (!hashObj["art"] && !hashObj["sport"]) {
    return activities;
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
  return newActivities;
}

function sortByRaitingStars(hashObj, activities) {
  const newDisplayedActivities = [];
  const raitingStars = +hashObj["raiting-stars"];
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].raiting.raiting >= raitingStars) {
      newDisplayedActivities.push(activities[i]);
    }
  }
  if (hashObj["raiting-ascending"] === "true") {
    return newDisplayedActivities.sort(
      (a, b) => a.raiting.raiting - b.raiting.raiting
    );
  } else if (hashObj["raiting-descending"] === "true") {
    return newDisplayedActivities.sort(
      (a, b) => b.raiting.raiting - a.raiting.raiting
    );
  }
  return newDisplayedActivities;
}

function sortActivities(activities, hashObj) {
  let result = [...activities];
  if (hashObj["raiting-stars"]) {
    result = [...sortByRaitingStars(hashObj, result)];
  } else if (hashObj["raiting-ascending"] === "true") {
    result.sort((a, b) => a.raiting.raiting - b.raiting.raiting);
  } else if (hashObj["raiting-descending"] === "true") {
    result.sort((a, b) => b.raiting.raiting - a.raiting.raiting);
  }
  if (hashObj["date-ascending"] === "true") {
    result.sort((a, b) => sortDateOldest(a, b));
  } else if (hashObj["date-descending"] === "true") {
    result.sort((a, b) => sortDateNewest(a, b));
  }
  return filterSubject(result, hashObj);
}

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
