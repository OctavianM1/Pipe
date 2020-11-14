import React from "react";
import "./pagination.scss";
import useChangePage from "../../Hooks/useChangePage";

interface PaginationProps {
  hash: string;
  hashObj: { [key: string]: string };
  page: number;
  nrOfPages: number;
}

const Pagination = ({ hash, hashObj, page, nrOfPages }: PaginationProps) => {
  const handleChangePage = useChangePage(hashObj, hash);

  const loopInPages = (pages: (number | null)[]) => {
    const paginationNumbers: React.ReactNode[] = [];
    pages.forEach((i) => {
      if (i === null) {
        paginationNumbers.push(
          <div className="pagination__dots" key={Math.random()}>
            <span>...</span>
          </div>
        );
      } else {
        paginationNumbers.push(
          <button
            key={i}
            className={
              i === page
                ? "pagination__page pagination__page__current"
                : "pagination__page"
            }
            onClick={() => handleChangePage(i)}
          >
            <h3>{i}</h3>
          </button>
        );
      }
    });
    return paginationNumbers;
  };

  let paginationNumbers = [];
  if (nrOfPages < 9) {
    for (let i = 1; i <= nrOfPages; i++) {
      paginationNumbers.push(
        <button
          key={i}
          className={
            i === page
              ? "pagination__page pagination__page__current"
              : "pagination__page"
          }
          onClick={() => handleChangePage(i)}
        >
          <h3>{i}</h3>
        </button>
      );
    }
  } else {
    let pags: (number | null)[];
    if (page === 1) {
      pags = [1, 2, 3, null, Math.floor((nrOfPages + 1) / 2), null, nrOfPages];
    } else if (page === nrOfPages) {
      pags = [
        1,
        null,
        Math.floor(nrOfPages / 2),
        null,
        nrOfPages - 1,
        nrOfPages,
      ];
    } else if (page === 2) {
      pags = [1, 2, 3, null, Math.floor((nrOfPages + 2) / 2), null, nrOfPages];
    } else if (page === 3) {
      pags = [
        1,
        2,
        3,
        4,
        null,
        Math.floor((nrOfPages + 3) / 2),
        null,
        nrOfPages,
      ];
    } else if (page === nrOfPages - 1) {
      pags = [
        1,
        null,
        Math.floor((nrOfPages - 1) / 2),
        null,
        nrOfPages - 2,
        nrOfPages - 1,
        nrOfPages,
      ];
    } else if (page === nrOfPages - 2) {
      pags = [
        1,
        null,
        Math.floor((nrOfPages - 2) / 2),
        null,
        nrOfPages - 3,
        nrOfPages - 2,
        nrOfPages - 1,
        nrOfPages,
      ];
    } else {
      if (nrOfPages > 15 && page > 4 && page < nrOfPages - 4) {
        pags = [1];
        if (Math.floor(page / 2) !== 2) {
          pags.push(null);
        }
        pags.push(
          Math.floor(page / 2),
          null,
          page - 1,
          page,
          page + 1,
          null,
          Math.ceil((page + nrOfPages) / 2),
          null,
          nrOfPages
        );
      } else {
        pags = [1, null, page - 1, page, page + 1, null, nrOfPages];
      }
    }
    paginationNumbers = loopInPages(pags);
  }
  return <>{paginationNumbers}</>;
};

export default Pagination;
