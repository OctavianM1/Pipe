import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput from "../../components/SearchInput/SearchInput";

import { Link, useLocation } from "react-router-dom";

import useApiErrorHandler from "../../Hooks/useApiErrorHandler";

import "./following.scss";
import Grid4x4 from "../../components/Svgs/Girds/Grid4x4";
import Grid3x3 from "../../components/Svgs/Girds/Grid3x3";
import Grid2x2 from "../../components/Svgs/Girds/Grid2x2";
import { Follows as fws } from "../../api/axios";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import Loupe from "../../components/Svgs/Loupe";
import Loader from "../../components/Loader/Loader";
import User from "../../components/User/User";
import useGridOnResize from "../../Hooks/useGridOnResize";
import { Search } from "../../api/axios";
import useChangePage from "../../Hooks/useChangePage";
import useHash from "../../Hooks/useHash";
import Pagination from "../../components/Pagination/Pagination";
import sortUsers from "../../utilities/sortUsers";
import getDefaultSortUsersElements from "../../utilities/getDefaultSortUsersElements";
import SortDropDown from "../../components/SortDropDown/SortDropDown";

const Follows = () => {
  const [followsUsers, setFollowsUsers] = useState([]);
  const [grid, setGrid] = useState(3);
  const [loader, setLoader] = useState(true);

  const userId = JSON.parse(window.localStorage.getItem("user")).id;

  useGridOnResize(grid, setGrid);

  const error = useApiErrorHandler();

  const { hash } = useLocation();
  const hashObj = useHash();
  const sortedFollowsUsers = useMemo(() => {
    if (!hashObj["sort"]) return [...followsUsers];
    return sortUsers(hashObj["sort"], [...followsUsers]);
  }, [followsUsers, hashObj]);

  const page = Number(hashObj["p"]) || 1;

  const nrOfPages = Math.ceil(followsUsers.length / 6 / grid);

  const usersOnCurrentPage = useMemo(() => {
    const result = [];
    for (
      let i = (page - 1) * 6 * grid;
      i < 6 * grid * page && sortedFollowsUsers[i];
      i++
    ) {
      result.push(sortedFollowsUsers[i]);
    }
    return result;
  }, [sortedFollowsUsers, grid, page]);

  const handleChangePage = useChangePage(hashObj, hash);
  const handleGridChange = (newGrid) => {
    const nrOfNewPages = Math.ceil(followsUsers.length / 6 / newGrid);
    if (page > nrOfNewPages) {
      handleChangePage(nrOfNewPages);
    }
    setGrid(newGrid);
  };

  useEffect(() => {
    fws
      .follows(userId)
      .then((users) => {
        setFollowsUsers(users);
        setLoader(false);
      })
      .catch(error);
  }, [error, userId]);

  const onGetInputs = useCallback(
    (matchString) => Search.followsUsers(userId, matchString),
    [userId]
  );

  const onSetInput = useCallback(
    (input) => Search.setInputFollowsUsers({ userId, input }),
    [userId]
  );

  const onDeleteInput = useCallback(
    (input) => Search.deleteFollowsUsersInput(userId, input),
    [userId]
  );

  return (
    <>
      <Link to="/search-users" className="search-users">
        <Loupe />
      </Link>
      <div className="following">
        <div className="following__search">
          <SearchInput
            placeholder="Search for users"
            onGetInputs={onGetInputs}
            onSetInput={onSetInput}
            onDeleteInput={onDeleteInput}
            setUsers={setFollowsUsers}
          />
        </div>
        {loader ? (
          <div className="f-loader">
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
                <div className="following__nobody">
                  <div>There is no user following you!</div>
                  <Link to="/search-users" className="follows__btn">
                    <StandardButton>Search</StandardButton>
                  </Link>
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
      </div>
    </>
  );
};

export default React.memo(Follows);
