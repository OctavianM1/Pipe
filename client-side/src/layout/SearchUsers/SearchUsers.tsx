import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./searchUsers.scss";
import Loader from "../../components/Loader/Loader";
import SearchInput from "../../components/SearchInput/SearchInput";
import Grid2x2 from "../../components/Svgs/Girds/Grid2x2";
import Grid3x3 from "../../components/Svgs/Girds/Grid3x3";
import Grid4x4 from "../../components/Svgs/Girds/Grid4x4";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import User from "../../components/User/User";
import { Search } from "../../api/axios";
import useGridOnResize from "../../Hooks/useGridOnResize";
import useHash from "../../Hooks/useHash";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import useChangePage from "../../Hooks/useChangePage";
import SortDropDown from "../../components/SortDropDown/SortDropDown";
import getDefaultSortUsersElements from "../../utilities/getDefaultSortUsersElements";
import sortUsers from "../../utilities/sortUsers";
import { ServerUser, ServerSearchInput } from "../../api/serverDataInterfaces";
import useDataOnCurrentPage from "../../Hooks/useDataOnCurrentPage";

const SearchUsers = () => {
  const [loader, setLoader] = useState(true);
  const [grid, setGrid] = useState(3);
  const [users, setUsers] = useState<ServerUser[]>([]);

  const { hash } = useLocation();
  const hashObj = useHash();

  const sortedUsers = useMemo(() => {
    let newUsers = [...users];
    if (hashObj["search"]) {
      newUsers = newUsers.filter((u) => u.name.startsWith(hashObj["search"]));
    }
    if (!hashObj["sort"]) return newUsers;
    return sortUsers(hashObj["sort"], newUsers);
  }, [users, hashObj]);

  const page = Number(hashObj["p"]) || 1;

  const nrOfPages = Math.ceil(sortedUsers.length / 6 / grid);

  const usersOnCurrentPage: ServerUser[] = useDataOnCurrentPage(
    page,
    sortedUsers,
    6 * grid
  );

  const error = useApiErrorHandler();
  const handleChangePage = useChangePage(hashObj, hash);
  const handleGridChange = (newGrid: number) => {
    const nrOfNewPages = Math.ceil(users.length / 6 / newGrid);
    if (page > nrOfNewPages) {
      handleChangePage(nrOfNewPages);
    }
    setGrid(newGrid);
  };

  useGridOnResize(grid, setGrid);

  const userId = JSON.parse(window.localStorage.getItem("user") || "{}").id;

  useEffect(() => {
    Search.userNumber(100)
      .then((users: ServerUser[]) => {
        setUsers(users);
        setLoader(false);
      })
      .catch(error);
  }, [error]);

  const onGetInputs: (
    matchString?: string
  ) => Promise<ServerSearchInput[]> = useCallback(
    (matchString?: string) => Search.allUsers(userId, matchString),
    [userId]
  );

  const onSetInput: (
    input: string | undefined
  ) => Promise<ServerUser[]> = useCallback(
    (input: string | undefined) => Search.setInputAllUsers({ userId, input }),
    [userId]
  );

  const onDeleteInput: (
    input: string | undefined
  ) => Promise<any> = useCallback(
    (input: string | undefined) => Search.deleteAllUsersInput(userId, input),
    [userId]
  );
 
  return (
    <div className="following">
      <div className="following__search">
        <SearchInput
          placeholder="Search for users"
          onGetInputs={onGetInputs}
          onSetInput={onSetInput}
          onDeleteInput={onDeleteInput}
          setUsers={setUsers}
          defaultValue={hashObj['search']}
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
                  activities={u.numberOfActivities || 0}
                  grid={grid}
                  extension={u.coverImageExtension}
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
    </div>
  );
};

export default React.memo(SearchUsers);
