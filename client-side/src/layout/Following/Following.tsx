import React, { useEffect, useMemo, useState } from "react";
import "./following.scss";
import "../../components/CSSTransitions/cssTransitions.scss";
import SearchInput from "../../components/SearchInput/SearchInput";
import { Link, useLocation } from "react-router-dom";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import Grid4x4 from "../../components/Svgs/Girds/Grid4x4";
import Grid3x3 from "../../components/Svgs/Girds/Grid3x3";
import Grid2x2 from "../../components/Svgs/Girds/Grid2x2";
import { Follows } from "../../api/axios";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import Loupe from "../../components/Svgs/Loupe";
import Loader from "../../components/Loader/Loader";
import User from "../../components/User/User";
import useGridOnResize from "../../Hooks/useGridOnResize";
import { Search } from "../../api/axios";
import Pagination from "../../components/Pagination/Pagination";
import useHash from "../../Hooks/useHash";
import useChangePage from "../../Hooks/useChangePage";
import SortDropDown from "../../components/SortDropDown/SortDropDown";
import sortUsers from "../../utilities/sortUsers";
import getDefaultSortUsersElements from "../../utilities/getDefaultSortUsersElements";
import { ServerUser, ServerSearchInput } from "../../api/serverDataInterfaces";
import useDataOnCurrentPage from "../../Hooks/useDataOnCurrentPage";

const Following = () => {
  const [followingUsers, setFollowingUsers] = useState<ServerUser[]>([]);
  const [grid, setGrid] = useState(3);
  const [loader, setLoader] = useState(true);

  const userId = JSON.parse(window.localStorage.getItem("user") || "{}").id;

  const { hash } = useLocation();
  const hashObj = useHash();

  const sortedFollowingUsers = useMemo(() => {
    if (!hashObj["sort"]) return [...followingUsers];
    return sortUsers(hashObj["sort"], [...followingUsers]);
  }, [followingUsers, hashObj]);

  const page = Number(hashObj["p"]) || 1;

  const nrOfPages = Math.ceil(followingUsers.length / 6 / grid);

  const usersOnCurrentPage = useDataOnCurrentPage(
    page,
    sortedFollowingUsers,
    grid * 6
  );

  const handleChangePage = useChangePage(hashObj, hash);
  const handleGridChange = (newGrid: number) => {
    const nrOfNewPages = Math.ceil(followingUsers.length / 6 / newGrid);
    if (page > nrOfNewPages) {
      handleChangePage(nrOfNewPages);
    }
    setGrid(newGrid);
  };

  useGridOnResize(grid, setGrid);

  const error = useApiErrorHandler();

  useEffect(() => {
    Follows.following(userId)
      .then((users: ServerUser[]) => {
        setFollowingUsers(users);
        setLoader(false);
      })
      .catch(error);
  }, [error, userId]);

  const onGetInputs: (matchString?: string) => Promise<ServerSearchInput[]> = (
    matchString?: string
  ) => Search.followingUsers(userId, matchString);

  const onSetInput: (input: string | undefined) => Promise<ServerUser[]> = (
    input: string | undefined
  ) => Search.setInputFollowingUsers({ userId, input });

  const onDeleteInput: (input: string | undefined) => Promise<any> = (
    input: string | undefined
  ) => Search.deleteFollowingUsersInput(userId, input);


  return (
    <>
      <Link to="/search-users" className="search-users bottom-right-icon">
        <Loupe />
        <span>
          Search in all users
          <span className="bottom-right-icon-arrow">&nbsp;</span>
        </span>
      </Link>
      <div className="following">
        <div className="following__search">
          <SearchInput
            placeholder="Search for users"
            onGetInputs={onGetInputs}
            onSetInput={onSetInput}
            onDeleteInput={onDeleteInput}
            setUsers={setFollowingUsers}
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
                    activities={u.numberOfActivities || 0}
                    grid={grid}
                  />
                ))
              ) : (
                <div className="following__nobody">
                  <div>There is no user you are following!</div>
                  <Link to="/search-users">
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

export default React.memo(Following);
