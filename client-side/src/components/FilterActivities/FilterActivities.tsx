import React, { useEffect, useRef, useState } from "react";
import useHash from "../../Hooks/useHash";
import useReplaceHash from "../../Hooks/useReplaceHash";
import StarsRaiting from "../StarsRaiting/StarsRaiting";
import "./filterActivities.scss";

const FilterActivities = () => {
  const hashObj = useHash();
  const [raitingStarsMin, setRaitingStarsMin] = useState(
    +hashObj["raiting-stars-min"] || 0
  );
  const [raitingStarsMax, setRaitingStarsMax] = useState(
    +hashObj["raiting-stars-max"] || 5
  );
  const [title, setTitle] = useState(hashObj["title"] || "");
  const [subject, setSubject] = useState(hashObj["subject"] || "");

  const raitingUlRef = useRef<HTMLUListElement>(null);
  const titleUlRef = useRef<HTMLUListElement>(null);
  const subjectUlRef = useRef<HTMLUListElement>(null);

  const replaceHash = useReplaceHash();

  const handleRaitingMinStarClick = (nrStars: number) => {
    replaceHash(
      window.location.hash,
      `&raiting-stars-min=${raitingStarsMin}`,
      `&raiting-stars-min=${nrStars}`
    );
    window.scroll({ top: 0, behavior: "smooth" });
    setRaitingStarsMin(nrStars);
  };

  const handleRaitingMaxStarClick = (nrStars: number) => {
    replaceHash(
      window.location.hash,
      `&raiting-stars-max=${raitingStarsMin}`,
      `&raiting-stars-max=${nrStars}`
    );
    window.scroll({ top: 0, behavior: "smooth" });
    setRaitingStarsMax(nrStars);
  };

  const removeRaitingMin = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    replaceHash(
      window.location.hash,
      `&raiting-stars-min=${raitingStarsMin}`,
      ""
    );
    const el = ev.target as HTMLElement;
    onRemove(el);
    setRaitingStarsMin(0);
  };

  const removeRaitingMax = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    replaceHash(
      window.location.hash,
      `&raiting-stars-max=${raitingStarsMax}`,
      ""
    );
    const el = ev.target as HTMLElement;
    onRemove(el);
    setRaitingStarsMax(5);
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

  useEffect(() => {
    const raitingMinHash = +hashObj["raiting-stars-min"] || 0;
    const raitingMaxHash = +hashObj["raiting-stars-max"] || 5;
    const titleHash = hashObj["title"] || "";
    const subjectHash = hashObj["subject"] || "";
    if (raitingMinHash !== raitingStarsMin) {
      if (
        raitingMinHash === 0 &&
        raitingMaxHash === 0 &&
        raitingUlRef.current
      ) {
        raitingUlRef.current.classList.add("filterActivities__list__hidden");
      }
      setRaitingStarsMin(raitingMinHash);
    }
    if (raitingMaxHash !== raitingStarsMax) {
      setRaitingStarsMax(raitingMaxHash);
    }
    if (titleHash !== title) {
      if (titleHash === "" && titleUlRef.current) {
        titleUlRef.current.classList.add("filterActivities__list__hidden");
      }
      setTitle(titleHash);
    }
    if (subjectHash !== subject) {
      if (subjectHash === "" && subjectUlRef.current) {
        subjectUlRef.current.classList.add("filterActivities__list__hidden");
      }
      setSubject(subjectHash);
    }
  }, [title, subject, raitingStarsMin, hashObj, raitingStarsMax]);

  return (
    <div className="filterActivities">
      <h1>Filter</h1>
      <div>
        <h2 onClick={toggleDisplayList}>Raiting</h2>
        <ul
          ref={raitingUlRef}
          className="filterActivities__list filterActivities__list__hidden"
        >
          <li className="filterActivities__list__item">
            <span>Min Stars:</span>
            <div>
              <StarsRaiting
                initialState={raitingStarsMin}
                handleStarClick={handleRaitingMinStarClick}
              />
            </div>
            <img
              onClick={removeRaitingMin}
              className={
                raitingStarsMin === 0
                  ? "filterActivities__list__item__img-pasive"
                  : "filterActivities__list__item__img-active"
              }
              src="/images/activities/cancel.svg"
              alt="cancel"
            />
          </li>
          <li className="filterActivities__list__item">
            <span>Max Stars:</span>
            <div>
              <StarsRaiting
                initialState={raitingStarsMax}
                handleStarClick={handleRaitingMaxStarClick}
              />
            </div>
            <img
              onClick={removeRaitingMax}
              className={
                raitingStarsMax === 5
                  ? "filterActivities__list__item__img-pasive"
                  : "filterActivities__list__item__img-active"
              }
              src="/images/activities/cancel.svg"
              alt="cancel"
            />
          </li>
        </ul>
      </div>
      <div>
        <h2 onClick={toggleDisplayList}>Title</h2>
        <ul
          ref={titleUlRef}
          className="filterActivities__list filterActivities__list__hidden"
        >
          <li className="filterActivities__list__item">
            <input
              type="text"
              placeholder="Enter a title..."
              value={title}
              onChange={onChangeTitle}
            />
            <img
              onClick={removeTitle}
              className={
                title.length === 0
                  ? "filterActivities__list__item__img-pasive"
                  : "filterActivities__list__item__img-active"
              }
              src="/images/activities/cancel.svg"
              alt="cancel"
            />
          </li>
        </ul>
      </div>
      <div>
        <h2 onClick={toggleDisplayList}>Subject</h2>
        <ul
          ref={subjectUlRef}
          className="filterActivities__list filterActivities__list__hidden"
        >
          <li className="filterActivities__list__item">
            <input
              type="text"
              placeholder="Enter a subject..."
              value={subject}
              onChange={onChangeSubject}
            />
            <img
              onClick={removeSubject}
              className={
                subject.length === 0
                  ? "filterActivities__list__item__img-pasive"
                  : "filterActivities__list__item__img-active"
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
  window.scroll({ top: 0, behavior: "smooth" });
  const parent = el.parentElement!;
  let prev = parent;
  let next = parent;

  while (prev.previousElementSibling) {
    prev = prev.previousElementSibling as HTMLElement;
    if (prev.lastElementChild?.classList.contains('filterActivities__list__item__img-active')) {
      return;
    }
  }

  while (next.nextElementSibling) {
    next = next.nextElementSibling as HTMLElement;
    if (next.lastElementChild?.classList.contains('filterActivities__list__item__img-active')) {
      return;
    }
  }

  if (parent.parentElement) {
    parent.parentElement.classList.add("filterActivities__list__hidden");
  }
}

export default FilterActivities;
