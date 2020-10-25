import React, { useEffect, useState } from "react";
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

const SearchUsers = () => {
  const [loader, setLoader] = useState(true);
  const [grid, setGrid] = useState(3);
  const [users, setUsers] = useState([]);
  const [searchInputs, setSearchInputs] = useState([]);

  const error = useApiErrorHandler();
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

  useEffect(() => {
    Search.allUsers(userId, userId)
      .then((inputs) => setSearchInputs(inputs))
      .catch((err) => console.log(err));
  }, [userId]);

  const onSubmitSearch = (ev) => {
    const val = ev.target.userSearch.value;
    if (val.trim().length > 1 && val.trim().length < 51) {
      Search.setInputAllUsers({ userId: userId, input: val })
        .then(() => {
          console.log("submitted");
        })
        .catch(error);
    }
    ev.preventDefault();
  };

  const onChangeSearch = (ev) => {
    const val = ev.target.value;
    if (val.trim() !== "") {
      Search.allUsers(userId, val)
        .then(setSearchInputs)
        .catch((err) => console.log(err));
    } else {
      Search.allUsers(userId, userId)
        .then(setSearchInputs)
        .catch((err) => console.log(err));
    }
  };

  const onClickInput = (ev) => {
    const val = ev.target.innerHTML
      .split("<span>")
      .join("")
      .split("</span>")
      .join("");
    Search.setInputAllUsers({ userId: userId, input: val })
      .then(() => {
        console.log("submitted");
      })
      .catch(error);
  };

  const handleDeleteInput = (input) => {
    Search.deleteAllUsersInput(input)
      .then(() => console.log("deleted"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="following__search">
        <SearchInput
          placeholder="Search for users"
          onSubmit={onSubmitSearch}
          inputs={searchInputs}
          onChangeSearch={onChangeSearch}
          onClickInput={onClickInput}
          onDeleteInput={handleDeleteInput}
        />
      </div>
      {loader ? (
        <div className="searchUsers__loader">
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
            {users.length > 0 ? (
              users.map((u) => (
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
              <div className="searchUsers__nobody">
                <div>There is no users</div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SearchUsers;
