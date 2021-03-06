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
import useIsMounted from "../../Hooks/useIsMounted";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import SpanHoverFixedDisplayMsg from "../../components/SpanHoverFixedDisplayMsg/SpanHoverFixedDisplayMsg";

const Following = () => {
  const isMounted = useIsMounted();

  const [followingUsers, setFollowingUsers] = useState<ServerUser[]>([]);
  const [grid, setGrid] = useState(3);
  const [loader, setLoader] = useState(true);

  const userId = JSON.parse(window.localStorage.getItem("user") || "{}").id;

  const { hash, pathname } = useLocation();
  const hashObj = useHash();

  const sortedFollowingUsers = useMemo(() => {
    let newUsers = [...followingUsers];
    if (hashObj["search"]) {
      newUsers = newUsers.filter((u) => u.name.startsWith(hashObj["search"]));
    }
    if (!hashObj["sort"]) return newUsers;
    return sortUsers(hashObj["sort"], newUsers);
  }, [followingUsers, hashObj]);

  const page = Number(hashObj["p"]) || 1;

  const nrOfPages = Math.ceil(followingUsers.length / 6 / grid);

  const usersOnCurrentPage: ServerUser[] = useDataOnCurrentPage(
    page,
    sortedFollowingUsers,
    grid * 6
  );

  const handleChangePage = useChangePage(hashObj, hash);
  const handleGridChange = (newGrid: number) => {
    const nrOfNewPages = Math.ceil(sortedFollowingUsers.length / 6 / newGrid);
    if (page > nrOfNewPages) {
      handleChangePage(nrOfNewPages);
    }
    setGrid(newGrid);
  };

  useGridOnResize(grid, setGrid);

  const error = useApiErrorHandler();

  useDocumentTitle("Following");

  useEffect(() => {
    if (userId) {
      Follows.following(userId)
        .then((users: ServerUser[]) => {
          if (isMounted.current) {
            setFollowingUsers(users);
            setLoader(false);
          }
        })
        .catch(error);
    }
  }, [error, userId, isMounted]);

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
      <Link
        to={{
          pathname: "/search-users",
          state: { prevPath: pathname },
        }}
        className="search-users bottom-right-icon"
      >
        <Loupe />
        <SpanHoverFixedDisplayMsg text="Search in all users" />
      </Link>
      <div className="following">
        <div className="following__search">
          <SearchInput
            placeholder="Search for users"
            onGetInputs={onGetInputs}
            onSetInput={onSetInput}
            onDeleteInput={onDeleteInput}
            setUsers={setFollowingUsers}
            defaultValue={hashObj["search"]}
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
                    extension={u.coverImageExtension}
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
            <Pagination
              hash={hash}
              hashObj={hashObj}
              page={page}
              nrOfPages={nrOfPages}
            />
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(Following);
