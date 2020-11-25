import React, { useCallback, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useHash from "../../Hooks/useHash";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import useReplaceHash from "../../Hooks/useReplaceHash";

import "./sortDropDown.scss";

const SortDropDown = ({ elements }: { elements: any[] }) => {
  const [filter, setFilter] = useState(false);
  const filterContainer = useRef(null);

  useOutsideAlerter(
    filterContainer,
    filter,
    useCallback(() => setFilter(false), [])
  );

  const { hash } = useLocation();
  const hashObj = useHash();
  const replaceHash = useReplaceHash();

  const handleClickFilter = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const evTarget = ev.target as any;
    const acutalHash = `&sort=${evTarget.getAttribute("data-id")}`;
    window.location.hash = acutalHash;
    replaceHash(hash, `&sort=${hashObj["sort"]}`, acutalHash);
  };

  return (
    <div
      className="sortDropDown__display-filter"
      onClick={() => setFilter(!filter)}
      ref={filterContainer}
    >
      <img src="/images/filter/filter.svg" alt="filter" />
      <h2>Sort by</h2>
      <span
        className={
          filter
            ? "sortDropDown__display-filter__arrow sortDropDown__display-filter__arrow-active"
            : "sortDropDown__display-filter__arrow"
        }
      >
        &nbsp;
      </span>
      <div
        className={
          filter
            ? "sortDropDown__display-filter__drop-down sortDropDown__display-filter__drop-down-active"
            : "sortDropDown__display-filter__drop-down"
        }
        onClick={handleClickFilter}
      >
        {elements.map((el) => (
          <div
            key={el.dataid}
            className={
              hashObj["sort"] === el.dataid
                ? "sort-active-el"
                : "sort-nonactive-el"
            }
            data-id={el.dataid}
          >
            {el.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SortDropDown);
