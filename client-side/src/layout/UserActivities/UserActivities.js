import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FilterSide from "../../components/FilterSide/FilterSide";

import "./userActivities.scss";

import { Activities, Users, Search, Follows } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import useHavePutLike from "../../Hooks/useHavePutLike";
import useHavePutRate from "../../Hooks/useHavePutRate";
import Activity from "./Activity";
import useHash from "../../Hooks/useHash";
import Loader from "../../components/Loader/Loader";
import { useMemo } from "react";
import Pagination from "../../components/Pagination/Pagination";
import SearchInput from "../../components/SearchInput/SearchInput";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";

const MyActivities = () => {
  const { userId: hostUserId } = useParams();
  const visitorUser = JSON.parse(window.localStorage.getItem("user"));

  const [activities, setActivities] = useState([]);
  const [loader, setLoader] = useState(true);
  const [displayNoActivitiesMsg, setDisplayNoActivitiesMsg] = useState(false);
  const [userData, setUserData] = useState({});

  const errorHandler = useApiErrorHandler();
  const { hash } = useLocation();
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
        window.scroll(0, 0);
      })
      .catch(errorHandler);
  }, [errorHandler, hostUserId]);

  useEffect(() => {
    Users.usersActivity(hostUserId, visitorUser.id)
      .then(setUserData)
      .catch(errorHandler);
  }, [hostUserId, visitorUser.id, errorHandler]);

  const havePutLike = useHavePutLike();
  const havePutRate = useHavePutRate();

  const handleRemoveActivity = (activityId) => {
    Activities.delete(activityId)
      .then(() => {
        const newActivities = activities.filter((a) => a.id !== activityId);
        setActivities(newActivities);
      })
      .catch(errorHandler);
  };

  useEffect(() => {
    if (activities.length === 0) {
      setDisplayNoActivitiesMsg(true);
    } else {
      displayNoActivitiesMsg && setDisplayNoActivitiesMsg(false);
    }
  }, [activities.length, displayNoActivitiesMsg]);

  const onGetInputs = useCallback(
    (matchString) =>
      Search.getActivities(hostUserId, visitorUser.id, matchString || ""),
    [hostUserId, visitorUser]
  );

  const onSetInput = useCallback(
    (matchString) =>
      Search.setInputActivities({
        userHostId: hostUserId,
        userVisitorId: visitorUser.id,
        userInput: matchString,
      }),
    [hostUserId, visitorUser]
  );

  const onDeleteInput = useCallback(
    (matchString) =>
      Search.deleteInputActivities({
        userHostId: hostUserId,
        userVisitorId: visitorUser.id,
        userInput: matchString || "",
      }),
    [hostUserId, visitorUser]
  );

  const handleFollowClick = () => {
    if (userData.isVisitorFollowingHost) {
      Follows.unfollow({ userId: hostUserId, followUserId: visitorUser.id })
        .then(() =>
          setUserData({
            ...userData,
            isVisitorFollowingHost: false,
            countFollows: userData.countFollows - 1,
          })
        )
        .catch(errorHandler);
    } else {
      Follows.follow({ userId: hostUserId, followUserId: visitorUser.id })
        .then(() =>
          setUserData({
            ...userData,
            isVisitorFollowingHost: true,
            countFollows: userData.countFollows + 1,
          })
        )
        .catch(errorHandler);
    }
  };

  return (
    <>
      {visitorUser && hostUserId === visitorUser.id && (
        <Link to="/add-activity" className="add-activity">
          <img src="/images/activities/plus.svg" alt="plus" />
        </Link>
      )}
      <div className="my-activities__search">
        <SearchInput
          placeholder="Search for activities"
          onGetInputs={onGetInputs}
          onSetInput={onSetInput}
          onDeleteInput={onDeleteInput}
          setUsers={setActivities}
        />
      </div>
      <div>
        {loader ? (
          <div className="my-activities__loader">
            <Loader />
          </div>
        ) : (
          <>
            {hostUserId !== visitorUser.id && (
              <div className="activities-info">
                <div>
                  Name: <span>{userData.name}</span>
                </div>
                <div>
                  Following: <span>{userData.countFollowing}</span>
                </div>
                <div>
                  Follows: <span>{userData.countFollows}</span>
                </div>
                <div>
                  Activities: <span>{userData.numberOfActivities}</span>
                </div>
                <StandardButton onClick={handleFollowClick}>
                  {userData.isVisitorFollowingHost ? "Unfollow" : "Follow"}
                </StandardButton>
              </div>
            )}
            <div className="my-activities">
              <div className="my-activities__filter-side">
                <FilterSide />
              </div>
              {displayNoActivitiesMsg ? (
                <div className="following__nobody">
                  <div style={{ marginTop: "12.5rem" }}>
                    No activities found!
                  </div>
                </div>
              ) : (
                <div className="my-activities__activities-side">
                  {activitiesOnCurrentPage.length > 0 ? (
                    activitiesOnCurrentPage.map((activity) => (
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
                          havePutLike(activity.likes.users, visitorUser.id)
                        }
                        likesNumber={activity.likes.likes}
                        personalRate={() =>
                          havePutRate(activity.raiting.users, visitorUser.id)
                        }
                        hostUserId={hostUserId}
                        visitorUser={visitorUser}
                        comments={activity.comments}
                      />
                    ))
                  ) : (
                    <div className="my-activities__activities-side__not-found">
                      No activities found!
                    </div>
                  )}
                  <div className="my-activities__pagination">
                    <Pagination
                      hash={hash}
                      hashObj={hashObj}
                      page={page}
                      nrOfPages={nrOfPages}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

function filterSubject(activities, hashObj) {
  if (!hashObj["art"] && !hashObj["sport"] && !hashObj["subj"]) {
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
  if (hashObj["subj"]) {
    const val = hashObj["subj"];
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].subject.toLowerCase().includes(val)) {
        newActivities.push(activities[i]);
      }
    }
  }
  return newActivities;
}

export default React.memo(MyActivities);

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
