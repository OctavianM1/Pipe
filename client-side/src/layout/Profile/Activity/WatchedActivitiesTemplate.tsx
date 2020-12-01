import React, { useEffect, useMemo, useRef, useState } from "react";
import { ServerActivity, ServerUser } from "../../../api/serverDataInterfaces";
import { Activities } from "../../../api/axios";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { VisitorUserContext } from "../../UserActivities/UserActivities";
import Activity from "../../UserActivities/Activity";
import useHavePutLike from "../../../Hooks/useHavePutLike";
import useHavePutRate from "../../../Hooks/useHavePutRate";
import Loader from "../../../components/Loader/Loader";
import useHash from "../../../Hooks/useHash";

const WatchedActivitiesTemplate = ({
  user,
  fetchActivities,
  headerString,
}: {
  user: ServerUser;
  fetchActivities: (body: {
    userId: string;
    took: number;
    toTake: number;
    sortBy: string;
  }) => Promise<any>;
  headerString: string;
}) => {
  const [activities, setActivities] = useState<ServerActivity[] | null>(null);
  const [took, setTook] = useState(0);

  const hashObj = useHash();

  const sortBy = useMemo(() => {
    setTook(0);
    setActivities(null);
    if (!hashObj["sort"]) return "default";
    return hashObj["sort"];
  }, [hashObj]);

  const activitiesParentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);

  const error = useApiErrorHandler();

  useEffect(() => {
    fetchActivities({
      userId: user.id,
      toTake: 5,
      took: took,
      sortBy,
    })
      .then((activs: ServerActivity[]) => {
        setActivities((oldActivs) => {
          if (oldActivs === null) {
            return activs;
          }
          return oldActivs.concat(activs);
        });
      })
      .catch(error);
  }, [user.id, error, took, fetchActivities, sortBy]);

  useEffect(() => {
    if (
      activitiesParentRef.current &&
      activitiesParentRef.current.lastElementChild &&
      activitiesParentRef.current.lastElementChild?.lastElementChild
    ) {
      const last =
        activitiesParentRef.current.lastElementChild.lastElementChild;
      const options = {
        threshold: 1.0,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting && activities && took !== activities.length) {
            setTook(activities.length);
            observer.disconnect();
          }
        });
      }, options);

      observer.observe(last);
    }
  }, [activities, took]);

  useEffect(() => {
    let header = headerRef.current;
    function onChangeHeader(ev: any) {
      header?.classList.remove("p-activity__header-active");
      setTimeout(() => {
        header?.classList.add("p-activity__header-active");
      }, 10);
    }
    if (header) {
      header.addEventListener("DOMSubtreeModified", onChangeHeader);
    }
    return () => {
      if (header) {
        header.addEventListener("DOMSubtreeModified", onChangeHeader);
      }
    };
  }, []);

  const handleRemoveActivity = (activityId: string) => {
    if (activities) {
      Activities.delete(activityId)
        .then(() => {
          const newActivities = activities.filter((a) => a.id !== activityId);
          setActivities(newActivities);
        })
        .catch(error);
    }
  };

  const havePutLike = useHavePutLike();
  const havePutRate = useHavePutRate();

  return (
    <>
      <h1 ref={headerRef} className="p-activity__header">
        {headerString}
      </h1>
      {activities ? (
        <div ref={activitiesParentRef}>
          {activities.length > 0 ? (
            <>
              <TransitionGroup>
                {activities.map((activity) => (
                  <CSSTransition
                    timeout={{
                      enter: 370,
                      exit: 300,
                    }}
                    onEnter={(a: any) => {
                      a.classList.add("activity-custom");
                    }}
                    onEntering={(a: any) => {
                      a.classList.add("activity-custom-active");
                    }}
                    appear
                    classNames="activity"
                    key={activity.id}
                    mountOnEnter
                  >
                    <VisitorUserContext.Provider value={user}>
                      <Activity
                        key={activity.id}
                        id={activity.id}
                        title={activity.title}
                        body={activity.body}
                        subject={activity.subject}
                        onRemove={() => handleRemoveActivity(activity.id)}
                        date={activity.dateTimeCreated}
                        totalRaiting={activity.raiting}
                        isLiked={havePutLike(activity.likes.users, user.id)}
                        likesNumber={activity.likes.likes}
                        personalRate={havePutRate(
                          activity.raiting.users,
                          user.id
                        )}
                        hostUserId={activity.userHostId}
                        comments={activity.comments}
                      />
                    </VisitorUserContext.Provider>
                  </CSSTransition>
                ))}
              </TransitionGroup>
              {took !== activities.length && (
                <div className="profile__loader">
                  <Loader />
                </div>
              )}
            </>
          ) : (
            <div className="my-activities__activities-side__not-found">
              No activities found!
            </div>
          )}
        </div>
      ) : (
        <div className="profile__loader">
          <Loader />
        </div>
      )}
    </>
  );
};

export default WatchedActivitiesTemplate;
