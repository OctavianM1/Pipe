import React, { createContext, useEffect, useState, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./userActivities.scss";
import { Activities, Users, Search } from "../../api/axios";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import useHavePutLike from "../../Hooks/useHavePutLike";
import useHavePutRate from "../../Hooks/useHavePutRate";
import Activity from "./Activity";
import useHash from "../../Hooks/useHash";
import Loader from "../../components/Loader/Loader";
import Pagination from "../../components/Pagination/Pagination";
import SearchInput from "../../components/SearchInput/SearchInput";
import {
  ServerActivity,
  ServerUsersRelationActivity,
  ServerUser,
} from "../../api/serverDataInterfaces";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useDataOnCurrentPage from "../../Hooks/useDataOnCurrentPage";
import ActivitiesInfo from "./ActivitiesInfo";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import FilterActivities from "../../components/FilterActivities/FilterActivities";
import SortDropDown from "../../components/SortDropDown/SortDropDown";
import getDefaultSortActivityElements from "../../utilities/getDefaultSortActivityElements";

export const VisitorUserContext = createContext<ServerUser>(null!);

const MyActivities = () => {
  const visitorUser: ServerUser = JSON.parse(
    window.localStorage.getItem("user") || "{}"
  );
  const errorHandler = useApiErrorHandler();
  const { userId: hostUserId } = useParams<{ userId: string }>();

  const [activities, setActivities] = useState<ServerActivity[]>([]);
  const [loader, setLoader] = useState(true);
  const [displayNoActivitiesMsg, setDisplayNoActivitiesMsg] = useState(false);
  const [userData, setUserData] = useState<ServerUsersRelationActivity>(null!);

  const { hash } = useLocation();
  const hashObj = useHash();

  const page = Number(hashObj["p"]) || 1;

  const sortedActivities = useMemo(() => {
    return sortActivities(activities, hashObj);
  }, [activities, hashObj]);

  const nrOfPages = Math.ceil(sortedActivities.length / 5);

  const activitiesOnCurrentPage = useDataOnCurrentPage(
    page,
    sortedActivities,
    5
  );

  useEffect(() => {
    Activities.list(hostUserId)
      .then((activs: ServerActivity[]) => {
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

  const handleRemoveActivity = (activityId: string) => {
    Activities.delete(activityId)
      .then(() => {
        const newActivities = activities.filter((a) => a.id !== activityId);
        setActivities(newActivities);
      })
      .catch(errorHandler);
  };

  useDocumentTitle(`${userData ? userData.name : "Anonym"} activities`, [
    userData,
  ]);

  useEffect(() => {
    if (activities.length === 0) {
      setDisplayNoActivitiesMsg(true);
    } else {
      displayNoActivitiesMsg && setDisplayNoActivitiesMsg(false);
    }
  }, [activities.length, displayNoActivitiesMsg]);

  const onGetInputs = (matchString?: string) =>
    Search.getActivities(hostUserId, visitorUser.id, matchString || "");

  const onSetInput = (matchString: string) =>
    Search.setInputActivities({
      userHostId: hostUserId,
      userVisitorId: visitorUser.id,
      userInput: matchString,
    });

  const onDeleteInput = (matchString?: string) =>
    Search.deleteInputActivities({
      userHostId: hostUserId,
      userVisitorId: visitorUser.id,
      userInput: matchString || "",
    });

  return (
    <>
      {visitorUser && hostUserId === visitorUser.id && (
        <Link to="/add-activity" className="bottom-right-icon">
          <img src="/images/activities/plus.svg" alt="plus" />
          <span>
            Create an activity
            <span className="bottom-right-icon-arrow">&nbsp;</span>
          </span>
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
            {hostUserId !== visitorUser.id && userData && (
              <ActivitiesInfo
                setUserData={setUserData}
                userData={userData}
                errorHandler={errorHandler}
              />
            )}
            <div className="my-activities">
              <div className="my-activities__filter-side">
                <div
                  style={
                    visitorUser && hostUserId === visitorUser.id
                      ? { position: "sticky", top: "10px" }
                      : { position: "sticky", top: "80px" }
                  }
                >
                  <FilterActivities />
                  <SortDropDown elements={getDefaultSortActivityElements} />
                </div>
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
                    <TransitionGroup>
                      {activitiesOnCurrentPage.map((activity) => (
                        <CSSTransition
                          timeout={{
                            enter: 370,
                            exit: 300,
                          }}
                          classNames="activity"
                          key={activity.id}
                          mountOnEnter={true}
                        >
                          <VisitorUserContext.Provider value={visitorUser}>
                            <Activity
                              key={activity.id}
                              id={activity.id}
                              title={activity.title}
                              body={activity.body}
                              subject={activity.subject}
                              onRemove={() => handleRemoveActivity(activity.id)}
                              date={activity.dateTimeCreated}
                              totalRaiting={activity.raiting}
                              isLiked={havePutLike(
                                activity.likes.users,
                                visitorUser.id
                              )}
                              likesNumber={activity.likes.likes}
                              personalRate={havePutRate(
                                activity.raiting.users,
                                visitorUser.id
                              )}
                              hostUserId={hostUserId}
                              comments={activity.comments}
                            />
                          </VisitorUserContext.Provider>
                        </CSSTransition>
                      ))}
                    </TransitionGroup>
                  ) : (
                    <div className="my-activities__activities-side__not-found">
                      No activities found!!
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

function filterSubject(
  activities: ServerActivity[],
  hashObj: { [key: string]: string }
) {
  const title = hashObj["title"]?.toLowerCase() || "";
  const subject = hashObj["subject"]?.toLowerCase() || "";
  const raitingMin = +hashObj["raiting-stars-min"] - 0.5 || 0;
  const raitingMax = +hashObj['raiting-stars-max'] || 5;
  return activities.filter(
    (a) =>
      a.title.toLowerCase().includes(title) &&
      a.subject.toLowerCase().includes(subject) &&
      a.raiting.raiting >= raitingMin && 
      a.raiting.raiting <= raitingMax
  );
}

function sortActivities(
  activities: ServerActivity[],
  hashObj: { [key: string]: string }
) {
  if (!hashObj["sort"]) return filterSubject(activities, hashObj);
  const sort = hashObj["sort"];
  let result: ServerActivity[] = [];
  if (sort === "raiting-ascending") {
    result = activities.sort((a, b) => a.raiting.raiting - b.raiting.raiting);
  } else if (sort === "raiting-descending") {
    result = activities.sort((a, b) => b.raiting.raiting - a.raiting.raiting);
  } else if (sort === "likes-ascending") {
    result = activities.sort((a, b) => a.likes.likes - b.likes.likes);
  } else if (sort === "likes-descending") {
    result = activities.sort((a, b) => b.likes.likes - a.likes.likes);
  } else if (sort === "newest") {
    result = activities.sort((a, b) => sortDateNewest(a, b));
  } else if (sort === "oldest") {
    result = activities.sort((a, b) => sortDateOldest(a, b));
  } else {
    throw new Error("Invalid sort");
  }
  return filterSubject(result, hashObj);
}

function sortDateOldest(a: ServerActivity, b: ServerActivity) {
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

function sortDateNewest(a: ServerActivity, b: ServerActivity) {
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

function getYear(date: string) {
  return +date.substring(6, 10);
}

function getMonth(date: string) {
  return +date.substring(3, 5);
}

function getDay(date: string) {
  return +date.substring(0, 2);
}

function getHours(date: string) {
  return +date.substring(11, 13);
}

function getMinutes(date: string) {
  return +date.substring(14, 16);
}

export default MyActivities;
