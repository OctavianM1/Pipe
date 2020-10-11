import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useHash from "../../Hooks/useHash";

import "./filterSide.scss";

const FilterSide = () => {
  const { hash: hashPath } = useLocation();

  const hashObj = useHash();

  const [raitingsFilter, setRaitingsFilter] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState(false);

  useEffect(() => {
    if (!hashPath) {
      setRaitingsFilter(false);
      setSubjectFilter(false);
    }
  }, [hashPath]);

  const replaceHash = useReplaceHash();
  const addHash = useAddHash();

  const changeRaitingFilter = (ev) => {
    if (ev.target.value === "ascending") {
      replaceHash(hashPath, "&descending=true", "&ascending=true");
    } else if (ev.target.value === "descending") {
      replaceHash(hashPath, "&ascending=true", "&descending=true");
    }
  };

  const changeSubjectFilter = (ev) => {
    addHash(hashPath, ev.target, replaceHash);
  };

  return (
    <div className="filterSide">
      <div className="filterSide__search">
        <h3>Search:</h3>
        <input placeholder="Search for activities" />
      </div>
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
          <div
            className="filterSide__filters__filter__content" 
          >
            <div>
              <input
                type="radio"
                name="raiting"
                value="ascending"
                id="ascending"
                checked={!!hashObj.ascending}
                onChange={changeRaitingFilter}
              />
              <label htmlFor="ascending">Ascending</label>
            </div>
            <div>
              <input
                type="radio"
                name="raiting"
                value="descending"
                id="descending"
                checked={!!hashObj.descending}
                onChange={changeRaitingFilter}
              />
              <label htmlFor="descending">Descending</label>
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
          </div>
        </div>
      </div>
    </div>
  );
};

function useReplaceHash() {
  return (hashPath, prevHash, actualHash) => {
    let newHashPath = "";
    if (hashPath.includes(prevHash)) {
      hashPath.split(prevHash).forEach((p) => {
        newHashPath += p;
      });
    } else {
      newHashPath += hashPath;
    }
    newHashPath += actualHash;
    window.location.hash = newHashPath;
  };
}

function useAddHash() {
  return (hashPath, ref, replaceHash) => {
    if (ref.checked) {
      window.location.hash = `${hashPath}&${ref.value}=true`;
    } else {
      replaceHash(hashPath, `&${ref.value}=true`, "");
    }
  };
}

export default FilterSide;
