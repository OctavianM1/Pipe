import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useHash from "../../Hooks/useHash";
import StarsRaiting from "../StarsRaiting/StarsRaiting";
import useReplaceHash from "../../Hooks/useReplaceHash";
import useAddHashOnChecked from "../../Hooks/useAddHashOnChecked";
import "./filterSide.scss";

const FilterSide = () => {
  const { hash: hashPath } = useLocation();

  const hashObj = useHash();
  const [raitingsFilter, setRaitingsFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState(false);

  const [numberRaitingStars, setNumberRaitingStars] = useState(
    hashObj["raiting-stars"] ? +hashObj["raiting-stars"] : 0
  );

  const specificSubjectInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hashPath) {
      setNumberRaitingStars(0);
    }
  }, [hashPath]);

  const replaceHash = useReplaceHash();
  const addHashOnChecked = useAddHashOnChecked();

  const changeSortFilter = (
    ev: ChangeEvent<HTMLInputElement>,
    string: string
  ) => {
    let newHashPath = replaceHash(hashPath, `&p=${hashObj["p"]}`, "&p=1");
    if (ev.target.value === `${string}-ascending`) {
      replaceHash(
        newHashPath,
        `&${string}-descending=true`,
        `&${string}-ascending=true`
      );
    } else if (ev.target.value === `${string}-descending`) {
      replaceHash(
        newHashPath,
        `&${string}-ascending=true`,
        `&${string}-descending=true`
      );
    }
  };

  const handleRaitingStarClick = (nrStars: number) => {
    let newHashPath = replaceHash(hashPath, `&p=${hashObj["p"]}`, "&p=1");
    replaceHash(
      newHashPath,
      `&raiting-stars=${numberRaitingStars}`,
      `&raiting-stars=${nrStars}`
    );
    setNumberRaitingStars(nrStars);
  };

  const changeSubjectFilter = (ev: ChangeEvent<HTMLInputElement>) => {
    addHashOnChecked(hashPath, ev.target, replaceHash);
  };

  const handleRemoveRadio = (
    ev: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    if (hashObj[evTarget.value] === "true") {
      replaceHash(hashPath, `&p=${hashObj["p"]}`, "&p=1");
      replaceHash(hashPath, `&${evTarget.value}=true`, "");
    }
  };

  const handleFilterSpecificSubject = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      replaceHash(
        hashPath,
        `&subj=${hashObj["subj"]}`,
        `&subj=${ev.target.value}`
      );
    } else {
      replaceHash(hashPath, `&subj=${hashObj["subj"]}`, "");
    }
  };

  const removeFilterSpecificSubject = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    evTarget.parentElement.firstChild.value = "";
    replaceHash(hashPath, `&subj=${hashObj["subj"]}`, "");
  };

  return (
    <div className="filterSide">
      <div className="filterSide__filters">
        <h3>SORT BY:</h3>
        <div
          className={
            raitingsFilter
              ? "filterSide__filters__filter filterSide__filters__filter-active"
              : "filterSide__filters__filter"
          }
        >
          <div
            className="filterSide__filters__filter__facade"
            onClick={() => setRaitingsFilter(!raitingsFilter)}
          >
            <div>Raiting</div>
            <img
              className={
                raitingsFilter
                  ? "filterSide__filters__filter__facade__arrow-down"
                  : "filterSide__filters__filter__facade__arrow-up"
              }
              src="/images/activities/filterside/down-arrow.svg"
              alt="arrow up"
            />
          </div>
          <div className="filterSide__filters__filter__content">
            <div>
              <input
                type="radio"
                name="raiting"
                value="raiting-ascending"
                id="raiting-ascending"
                checked={!!hashObj["raiting-ascending"]}
                onChange={(ev) => changeSortFilter(ev, "raiting")}
                onClick={handleRemoveRadio}
              />
              <label htmlFor="raiting-ascending">Ascending</label>
            </div>
            <div>
              <input
                type="radio"
                name="raiting"
                value="raiting-descending"
                id="raiting-descending"
                checked={!!hashObj["raiting-descending"]}
                onChange={(ev) => changeSortFilter(ev, "raiting")}
                onClick={handleRemoveRadio}
              />
              <label htmlFor="raiting-descending">Descending</label>
            </div>
            <div className="filterSide__filters__filter__content__raiting-stars">
              <span>Min stars</span>
              <StarsRaiting
                initialState={numberRaitingStars}
                handleStarClick={handleRaitingStarClick}
              />
            </div>
          </div>
        </div>
        <div
          className={
            dateFilter
              ? "filterSide__filters__filter filterSide__filters__filter-active"
              : "filterSide__filters__filter"
          }
        >
          <div
            className="filterSide__filters__filter__facade"
            onClick={() => setDateFilter(!dateFilter)}
          >
            <div>Date</div>
            <img
              className={
                dateFilter
                  ? "filterSide__filters__filter__facade__arrow-down"
                  : "filterSide__filters__filter__facade__arrow-up"
              }
              src="/images/activities/filterside/down-arrow.svg"
              alt="arrow up"
            />
          </div>
          <div className="filterSide__filters__filter__content">
            <div>
              <input
                type="radio"
                name="date"
                value="date-ascending"
                id="date-ascending"
                checked={!!hashObj["date-ascending"]}
                onChange={(ev) => changeSortFilter(ev, "date")}
                onClick={handleRemoveRadio}
              />
              <label htmlFor="date-ascending">Oldest</label>
            </div>
            <div>
              <input
                type="radio"
                name="date"
                value="date-descending"
                id="date-descending"
                checked={!!hashObj["date-descending"]}
                onChange={(ev) => changeSortFilter(ev, "date")}
                onClick={handleRemoveRadio}
              />
              <label htmlFor="date-descending">Newest</label>
            </div>
          </div>
        </div>
        <h3 style={{ marginTop: "35px" }}>FILTER BY:</h3>
        <div
          className={
            subjectFilter
              ? "filterSide__filters__filter filterSide__filters__filter-active"
              : "filterSide__filters__filter"
          }
        >
          <div
            className="filterSide__filters__filter__facade"
            onClick={() => setSubjectFilter(!subjectFilter)}
          >
            <div>Subject</div>
            <img
              className={
                subjectFilter
                  ? "filterSide__filters__filter__facade__arrow-down"
                  : "filterSide__filters__filter__facade__arrow-up"
              }
              src="/images/activities/filterside/down-arrow.svg"
              alt="arrow up"
            />
          </div>
          <div className="filterSide__filters__filter__content">
            <div>
              <input
                type="checkbox"
                value="art"
                id="art"
                checked={!!hashObj.art}
                onChange={changeSubjectFilter}
              />
              <label htmlFor="art">Art</label>
            </div>
            <div>
              <input
                type="checkbox"
                value="sport"
                id="sport"
                checked={!!hashObj.sport}
                onChange={changeSubjectFilter}
              />
              <label htmlFor="sport">Sport</label>
            </div>
            <div className="specific-subject">
              <input
                ref={specificSubjectInput}
                type="text"
                placeholder="Specific subject filter"
                onChange={handleFilterSpecificSubject}
              />
              {specificSubjectInput &&
                specificSubjectInput.current &&
                specificSubjectInput.current.value && (
                  <img
                    onClick={removeFilterSpecificSubject}
                    src="/images/activities/cancel.svg"
                    alt="cancel"
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSide;
