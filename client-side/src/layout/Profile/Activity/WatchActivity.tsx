import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import useHash from "../../../Hooks/useHash";
import useReplaceHash from "../../../Hooks/useReplaceHash";

const WatchActivity = () => {
  const hashObj = useHash();
  const [itemIdx, setItemIdx] = useState(
    hashObj["watch"] === "liked-comments"
      ? 2
      : hashObj["watch"] === "rated-activities"
      ? 1
      : 0
  );

  const { hash } = useLocation();
  const replaceHash = useReplaceHash();

  const onNavigate = (itemIdx: number) => {
    if (itemIdx === 0) {
      replaceHash(
        hash,
        `&watch=${hashObj["watch"]}`,
        "&watch=liked-activities"
      );
      setItemIdx(0);
    } else if (itemIdx === 1) {
      replaceHash(
        hash,
        `&watch=${hashObj["watch"]}`,
        "&watch=rated-activities"
      );
      setItemIdx(1);
    } else if (itemIdx === 2) {
      replaceHash(hash, `&watch=${hashObj["watch"]}`, "&watch=liked-comments");
      setItemIdx(2);
    }
  };

  return (
    <CSSTransition
      unmountOnExit
      in={hashObj["tab"] === "activity"}
      timeout={{
        exit: 500,
        enter: 500,
      }}
      classNames="extind"
    >
      <ul>
        <h1>Watch</h1>
        <li
          className={itemIdx === 0 ? "profile__side-bar__active" : ""}
          onClick={() => onNavigate(0)}
        >
          Liked Activities
        </li>
        <li
          className={itemIdx === 1 ? "profile__side-bar__active" : ""}
          onClick={() => onNavigate(1)}
        >
          Rated Activities
        </li>
        <li
          className={itemIdx === 2 ? "profile__side-bar__active" : ""}
          onClick={() => onNavigate(2)}
        >
          Liked Comments
        </li>
      </ul>
    </CSSTransition>
  );
};

export default WatchActivity;
