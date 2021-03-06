import React, { useEffect, useMemo, useState } from "react";
import "./following.scss";
import SearchInput from "../../components/SearchInput/SearchInput";
import { Link, useLocation } from "react-router-dom";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
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
import { ServerUser, ServerSearchInput } from "../../api/serverDataInterfaces";
import useDataOnCurrentPage from "../../Hooks/useDataOnCurrentPage";
import useIsMounted from "../../Hooks/useIsMounted";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import SpanHoverFixedDisplayMsg from "../../components/SpanHoverFixedDisplayMsg/SpanHoverFixedDisplayMsg";

const Follows = () => {
  const isMounted = useIsMounted();
  const [followsUsers, setFollowsUsers] = useState<ServerUser[]>([]);
  const [grid, setGrid] = useState(3);
  const [loader, setLoader] = useState(true);

  const userId = JSON.parse(window.localStorage.getItem("user") || "{}").id;

  useGridOnResize(grid, setGrid);

  const error = useApiErrorHandler();

  const { hash, pathname } = useLocation();
  const hashObj = useHash();
  const sortedFollowsUsers = useMemo(() => {
    let newUsers = [...followsUsers];
    if (hashObj["search"]) {
      newUsers = newUsers.filter((u) => u.name.startsWith(hashObj["search"]));
    }
    if (!hashObj["sort"]) return newUsers;
    return sortUsers(hashObj["sort"], newUsers);
  }, [followsUsers, hashObj]);

  const page = Number(hashObj["p"]) || 1;

  const nrOfPages = Math.ceil(followsUsers.length / 6 / grid);

  const usersOnCurrentPage: ServerUser[] = useDataOnCurrentPage(
    page,
    sortedFollowsUsers,
    6 * grid
  );

  const handleChangePage = useChangePage(hashObj, hash);
  const handleGridChange = (newGrid: number) => {
    const nrOfNewPages = Math.ceil(sortedFollowsUsers.length / 6 / newGrid);
    if (page > nrOfNewPages) {
      handleChangePage(nrOfNewPages);
    }
    setGrid(newGrid);
  };

  useDocumentTitle("Follows");

  useEffect(() => {
    if (userId) {
      fws
        .follows(userId)
        .then((users: ServerUser[]) => {
          if (isMounted.current) {
            setFollowsUsers(users);
            setLoader(false);
          }
        })
        .catch(error);
    }
  }, [error, userId, isMounted]);

  const onGetInputs: (matchString?: string) => Promise<ServerSearchInput[]> = (
    matchString?: string
  ) => Search.followsUsers(userId, matchString);

  const onSetInput: (input: string | undefined) => Promise<ServerUser[]> = (
    input: string | undefined
  ) => Search.setInputFollowsUsers({ userId, input });

  const onDeleteInput: (input: string | undefined) => Promise<any> = (
    input: string | undefined
  ) => Search.deleteFollowsUsersInput(userId, input);

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
            setUsers={setFollowsUsers}
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
                    grid={grid}
                    extension={u.coverImageExtension}
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

export default React.memo(Follows);
