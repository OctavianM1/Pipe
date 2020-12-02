import React, { useEffect, useRef, useState } from "react";
import "./profile.scss";
import { ServerUser } from "../../api/serverDataInterfaces";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import General from "./General/General";
import ProfileActivity from "./Activity/ProfileActivity";
import useReplaceHash from "../../Hooks/useReplaceHash";
import { useLocation } from "react-router-dom";
import useHash from "../../Hooks/useHash";
import WatchActivity from "./Activity/WatchActivity";
import SortDropDown from "../../components/SortDropDown/SortDropDown";
import getDefaultSortActivityElements from "../../utilities/getDefaultSortActivityElements";
import { CSSTransition } from "react-transition-group";
import useScrollToTop from "../../Hooks/useScrollToTop";
import FilterActivities from "../../components/FilterActivities/FilterActivities";

const Profile = () => {
  const hashObj = useHash();

  const [profileNavigateIdx, setProfileNavigateIdx] = useState(
    hashObj["tab"] === "activity" ? 1 : 0
  );

  const scrollToTopRef = useRef<HTMLDivElement>(null);
  useScrollToTop(scrollToTopRef);

  const user: ServerUser = JSON.parse(
    window.localStorage.getItem("user") || "{}"
  );

  const { hash } = useLocation();
  const replaceHash = useReplaceHash();

  const onNavigate = (idx: number) => {
    if (idx === 0) {
      replaceHash(hash, `&tab=${hashObj["tab"]}`, "&tab=general");
      setProfileNavigateIdx(0);
    } else if (idx === 1) {
      replaceHash(hash, `&tab=${hashObj["tab"]}`, "&tab=activity");
      setProfileNavigateIdx(1);
    }
  };

  useEffect(() => {
    const app = document.querySelector(".App");
    if (app) {
      console.log(app);
      app.classList.remove("overflow-hidden");
    }
    return () => {
      if (app) {
        app.classList.add("overflow-hidden");
      }
    };
  }, []);

  useEffect(() => {
    setProfileNavigateIdx(hashObj["tab"] === "activity" ? 1 : 0);
  }, [hashObj]);

  useDocumentTitle(`${user.name} profile`, [user.name]);

  return (
    <>
      <div className="profile">
        <div className="profile__all">
          <div className="profile__side-bar">
            <ul>
              <h1>Profile</h1>
              <li
                className={
                  profileNavigateIdx === 0 ? "profile__side-bar__active" : ""
                }
                onClick={() => onNavigate(0)}
              >
                General
              </li>
              <li
                className={
                  profileNavigateIdx === 1 ? "profile__side-bar__active" : ""
                }
                onClick={() => onNavigate(1)}
              >
                Activity
              </li>
            </ul>
            <WatchActivity />
            <CSSTransition
              timeout={300}
              classNames="fade"
              in={profileNavigateIdx === 1}
              unmountOnExit
            >
              <SortDropDown elements={getDefaultSortActivityElements} />
            </CSSTransition>
            <CSSTransition
              unmountOnExit
              in={hashObj["tab"] === "activity"}
              timeout={{
                exit: 500,
                enter: 500,
              }}
              classNames="extind"
            >
              <FilterActivities />
            </CSSTransition>
          </div>
          {profileNavigateIdx === 0 && <General user={user} />}
          {profileNavigateIdx === 1 && <ProfileActivity user={user} />}
        </div>
      </div>
      <div
        ref={scrollToTopRef}
        className="profile__arrow__scroll-to-top scroll-to-top__hide"
      >
        <img src="/images/profile/black-arrow-pointing-up.svg" alt="arrow up" />
      </div>
    </>
  );
};

export default Profile;
