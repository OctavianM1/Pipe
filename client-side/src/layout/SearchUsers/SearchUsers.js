import React, { useCallback, useEffect, useMemo, useState } from "react";
import Loader from "../../components/Loader/Loader";

import SearchInput from "../../components/SearchInput/SearchInput";
import Grid2x2 from "../../components/Svgs/Girds/Grid2x2";
import Grid3x3 from "../../components/Svgs/Girds/Grid3x3";
import Grid4x4 from "../../components/Svgs/Girds/Grid4x4";

import "./searchUsers.scss";

import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import User from "../../components/User/User";
import { Search } from "../../api/axios";
import useGridOnResize from "../../Hooks/userGridOnResize";
import useHash from "../../Hooks/useHash";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import useChangePage from "../../Hooks/useChangePage";
import SortDropDown from "../../components/SortDropDown/SortDropDown";
import getDefaultSortUsersElements from "../../utilities/getDefaultSortUsersElements";
import sortUsers from "../../utilities/sortUsers";

const SearchUsers = () => {
  const [loader, setLoader] = useState(true);
  const [grid, setGrid] = useState(3);
  const [users, setUsers] = useState([]);

  const { hash } = useLocation();
  const hashObj = useHash();

  const sortedUsers = useMemo(() => {
    if (!hashObj["sort"]) return [...users];
    return sortUsers(hashObj["sort"], [...users]);
  }, [users, hashObj]);

  const page = Number(hashObj["p"]) || 1;

  const nrOfPages = Math.ceil(users.length / 6 / grid);

  const usersOnCurrentPage = useMemo(() => {
    const result = [];
    for (
      let i = (page - 1) * 6 * grid;
      i < 6 * grid * page && sortedUsers[i];
      i++
    ) {
      result.push(sortedUsers[i]);
    }
    return result;
  }, [sortedUsers, grid, page]);

  const error = useApiErrorHandler();
  const handleChangePage = useChangePage(hashObj, hash);
  const handleGridChange = (newGrid) => {
    const nrOfNewPages = Math.ceil(users.length / 6 / newGrid);
    if (page > nrOfNewPages) {
      handleChangePage(nrOfNewPages);
    }
    setGrid(newGrid);
  };

  useGridOnResize(grid, setGrid);

  const userId = JSON.parse(window.localStorage.getItem("user")).id;

  useEffect(() => {
    Search.userNumber(100)
      .then((users) => {
        setUsers(users);
        setLoader(false);
      })
      .catch(error);
  }, [error]);

  const onGetInputs = useCallback(
    (matchString) => Search.allUsers(userId, matchString),
    [userId]
  );

  const onSetInput = useCallback(
    (input) => Search.setInputAllUsers({ userId, input }),
    [userId]
  );

  const onDeleteInput = useCallback(
    (input) => Search.deleteAllUsersInput(userId, input),
    [userId]
  );

  return (
    <>
      <div className="following__search">
        <SearchInput
          placeholder="Search for users"
          onGetInputs={onGetInputs}
          onSetInput={onSetInput}
          onDeleteInput={onDeleteInput}
          setUsers={setUsers}
        />
      </div>
      {loader ? (
        <div className="searchUsers__loader">
          <Loader />
        </div>
      ) : (
        <>
          <div className="following__display">
            <SortDropDown elements={getDefaultSortUsersElements} />
            <div className="following__display-grid">
              <Grid2x2
                active={grid === 2}
                onClick={() => handleGridChange(2)}
              />
              <Grid3x3
                active={grid === 3}
                onClick={() => handleGridChange(3)}
              />
              <Grid4x4
                active={grid === 4}
                onClick={() => handleGridChange(4)}
              />
            </div>
          </div>
          <div className="following__users">
            {usersOnCurrentPage.length > 0 ? (
              usersOnCurrentPage.map((u) => (
                <User
                  key={u.id}
                  id={u.id}
                  name={u.name}
                  following={u.countFollowing}
                  followers={u.countFollowers}
                  activities={u.numberOfActivities}
                  grid={grid}
                />
              ))
            ) : (
              <div className="searchUsers__nobody">
                <div>There is no users</div>
              </div>
            )}
          </div>
          <div className="searchUsers__pagination">
            <Pagination
              hash={hash}
              hashObj={hashObj}
              page={page}
              nrOfPages={nrOfPages}
            />
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(SearchUsers);
