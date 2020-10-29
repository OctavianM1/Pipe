import React, { useCallback, useEffect, useState } from "react";
import SearchInput from "../../components/SearchInput/SearchInput";

import { Link } from "react-router-dom";

import useApiErrorHandler from "../../Hooks/useApiErrorHandler";

import "./following.scss";
import Grid4x4 from "../../components/Svgs/Girds/Grid4x4";
import Grid3x3 from "../../components/Svgs/Girds/Grid3x3";
import Grid2x2 from "../../components/Svgs/Girds/Grid2x2";
import { Follows } from "../../api/axios";
import StandardButton from "../../components/Buttons/StandardBtn/StandardButton";
import Loupe from "../../components/Svgs/Loupe";
import Loader from "../../components/Loader/Loader";
import User from "../../components/User/User";
import useGridOnResize from "../../Hooks/userGridOnResize";
import { Search } from "../../api/axios";

const Following = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [grid, setGrid] = useState(3);
  const [loader, setLoader] = useState(true);

  const userId = JSON.parse(window.localStorage.getItem("user")).id;

  useGridOnResize(grid, setGrid);

  const error = useApiErrorHandler();

  useEffect(() => {
    Follows.following(userId)
      .then((users) => {
        setFollowingUsers(users);
        setLoader(false);
      })
      .catch(error);
  }, [error, userId]);

  const onGetInputs = useCallback(
    (matchString) => Search.followingUsers(userId, matchString),
    [userId]
  );

  const onSetInput = useCallback(
    (input) => Search.setInputFollowingUsers({ userId, input }),
    [userId]
  );

  const onDeleteInput = useCallback(
    (input) => Search.deleteFollowingUsersInput(userId, input),
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
            setUsers={setFollowingUsers}
          />
        </div>
        {loader ? (
          <div className="f-loader">
            <Loader />
          </div>
        ) : (
          <>
            <div className="following__display-grid">
              <Grid2x2 active={grid === 2} onClick={() => setGrid(2)} />
              <Grid3x3 active={grid === 3} onClick={() => setGrid(3)} />
              <Grid4x4 active={grid === 4} onClick={() => setGrid(4)} />
            </div>
            <div className="following__users">
              {followingUsers.length > 0 ? (
                followingUsers.map((u) => (
                  <User
                    key={u.id}
                    id={u.id}
                    name={u.name}
                    following={u.countFollowing}
                    followers={u.countFollowers}
                    grid={grid}
                  />
                ))
              ) : (
                <div className="following__nobody">
                  <div>You don't follow anyone</div>
                  <Link to="/search-users">
                    <StandardButton>Search</StandardButton>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(Following);
