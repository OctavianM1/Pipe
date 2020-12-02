import React, { useState } from "react";
import useHash from "../../Hooks/useHash";
import useReplaceHash from "../../Hooks/useReplaceHash";
import StarsRaiting from "../StarsRaiting/StarsRaiting";
import "./filterActivities.scss";

const FilterActivities = () => {
  const hashObj = useHash();
  const [numberRaitingStars, setNumberRaitingStars] = useState(
    +hashObj["raiting-stars"] || 0
  );
  const [title, setTitle] = useState(hashObj["title"] || "");
  const [subject, setSubject] = useState(hashObj["subject"] || "");

  const replaceHash = useReplaceHash();

  const handleRaitingStarClick = (nrStars: number) => {
    replaceHash(
      window.location.hash,
      `&raiting-stars=${numberRaitingStars}`,
      `&raiting-stars=${nrStars}`
    );
    window.scroll({ top: 0, behavior: "smooth" });
    setNumberRaitingStars(nrStars);
  };

  const removeRaiting = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    replaceHash(
      window.location.hash,
      `&raiting-stars=${numberRaitingStars}`,
      ""
    );
    const el = ev.target as HTMLElement;
    onRemove(el);
    setNumberRaitingStars(0);
  };

  const removeTitle = (ev: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const el = ev.target as HTMLElement;
    replaceHash(window.location.hash, `&title=${title}`, "");
    onRemove(el);
    setTitle("");
  };

  const onChangeTitle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = (ev.target as HTMLInputElement).value;
    replaceHash(window.location.hash, `&title=${title}`, `&title=${newTitle}`);
    setTitle(newTitle);
  };

  const removeSubject = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const el = ev.target as HTMLElement;
    replaceHash(window.location.hash, `&subject=${subject}`, "");
    onRemove(el);
    setSubject("");
  };

  const onChangeSubject = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = (ev.target as HTMLInputElement).value;
    replaceHash(
      window.location.hash,
      `&subject=${subject}`,
      `&subject=${newSubject}`
    );
    setSubject(newSubject);
  };

  const toggleDisplayList = (
    ev: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    const header = ev.target as HTMLElement;
    const list = header.nextElementSibling;
    if (list) {
      if (list.classList.contains("filterActivities__list__hidden")) {
        list.classList.remove("filterActivities__list__hidden");
      } else {
        list.classList.add("filterActivities__list__hidden");
      }
    }
  };

  return (
    <div className="filterActivities">
      <h1>Filter</h1>
      <div>
        <h2 onClick={toggleDisplayList}>Raiting</h2>
        <ul className="filterActivities__list filterActivities__list__hidden">
          <li className="filterActivities__list__item">
            <span>Min Stars:</span>
            <div>
              <StarsRaiting
                initialState={numberRaitingStars}
                handleStarClick={handleRaitingStarClick}
              />
            </div>
            <img
              onClick={removeRaiting}
              style={
                numberRaitingStars === 0
                  ? { visibility: "hidden" }
                  : { visibility: "visible" }
              }
              src="/images/activities/cancel.svg"
              alt="cancel"
            />
          </li>
        </ul>
      </div>
      <div>
        <h2 onClick={toggleDisplayList}>Title</h2>
        <ul className="filterActivities__list filterActivities__list__hidden">
          <li className="filterActivities__list__item">
            <input
              type="text"
              placeholder="Enter a title..."
              value={title}
              onChange={onChangeTitle}
            />
            <img
              onClick={removeTitle}
              style={
                title.length === 0
                  ? { visibility: "hidden" }
                  : { visibility: "visible" }
              }
              src="/images/activities/cancel.svg"
              alt="cancel"
            />
          </li>
        </ul>
      </div>
      <div>
        <h2 onClick={toggleDisplayList}>Subject</h2>
        <ul className="filterActivities__list filterActivities__list__hidden">
          <li className="filterActivities__list__item">
            <input
              type="text"
              placeholder="Enter a subject..."
              value={subject}
              onChange={onChangeSubject}
            />
            <img
              onClick={removeSubject}
              style={
                subject.length === 0
                  ? { visibility: "hidden" }
                  : { visibility: "visible" }
              }
              src="/images/activities/cancel.svg"
              alt="cancel"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

function onRemove(el: HTMLElement) {
  const parent = el.parentElement?.parentElement;
  if (parent) {
    parent.classList.add("filterActivities__list__hidden");
  }
  window.scroll({ top: 0, behavior: "smooth" });
}

export default FilterActivities;
