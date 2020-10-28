import React, { useEffect, useRef, useState } from "react";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import Loupe from "../Svgs/Loupe";

import "./searchInput.scss";

const SearchInput = ({
  placeholder,
  onGetInputs,
  onSetInput,
  onDeleteInput,
  setUsers,
}) => {
  const [dislpayDropDown, setDisplayDropDown] = useState(false);
  const [searchInputs, setSearchInputs] = useState([]);
  const [activeSeachInput, setActiveSearchInput] = useState(-1);
  const [numberOfLettersInput, setNumberOfLettersInput] = useState(0);
  const inputRef = useRef(null);

  const error = useApiErrorHandler();

  useEffect(() => {
    onGetInputs().then(setSearchInputs).catch(error);
  }, [onGetInputs, error]);

  const onChangeSearch = (ev) => {
    const val = ev.target.value;
    if (val.trim() !== "") {
      onGetInputs(val).then(setSearchInputs).catch(error);
    } else {
      onGetInputs().then(setSearchInputs).catch(error);
    }
    setNumberOfLettersInput(val.length);
  };

  const onClickInput = (ev) => {
    console.log(ev.target);
    let val = ev.target.innerHTML;
    if (val.substring(val.length - 9) === "</button>") {
      val = val.substring(0, val.length - 23);
    }
    if (val.substring(val.length - 6) === "</div>") {
      val = val.substring(5, val.length - 6);
    }
    val = val
      .substring(6, val.length - 7)
      .split("<span>")
      .join("")
      .split("</span>")
      .join("");
    onSetInput(val).then(setUsers).catch(error);
    inputRef.current.value = val;
  };

  const handleDeleteInput = (input) => {
    console.log(input);
    onDeleteInput(input)
      .then(() => console.log("deleted"))
      .catch(error);
  };

  useEffect(() => {
    function onKey(ev) {
      if (ev.keyCode === 38 && activeSeachInput > 0) {
        // arrow up
        inputRef.current.value = searchInputs[activeSeachInput - 1].userInput;
        setActiveSearchInput(activeSeachInput - 1);
      } else if (
        ev.keyCode === 40 &&
        activeSeachInput < searchInputs.length - 1
      ) {
        // arrow down
        inputRef.current.value = searchInputs[activeSeachInput + 1].userInput;
        setActiveSearchInput(activeSeachInput + 1);
      } else if (ev.keyCode === 13) {
        // enter
        onSetInput(inputRef.current.value).then(setUsers).catch(error);
        inputRef.current.blur();
      }
      setTimeout(() => {
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          inputRef.current.value.length;
      }, 0);
    }
    if (dislpayDropDown) {
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [dislpayDropDown, activeSeachInput, searchInputs, setUsers, error, onSetInput]);

  const handleOnMouseMove = (idx) => {
    setActiveSearchInput(idx);
  };

  const onCloseDropDown = () => {
    setDisplayDropDown(false);
    setActiveSearchInput(-1);
  };

  return (
    <form className="searchInput">
      <div className="searchInput__container">
        <input
          ref={inputRef}
          name="userSearch"
          placeholder={placeholder}
          className="searchInput__input"
          autoComplete="off"
          onFocus={() => setDisplayDropDown(true)}
          onBlur={onCloseDropDown}
          onChange={(ev) => onChangeSearch(ev)}
        />
        <button className="searchInput__back">
          <Loupe />
          <span>&nbsp;</span>
        </button>
      </div>
      <ul
        className={
          dislpayDropDown
            ? "searchInput__drop-down searchInput__drop-down-active"
            : "searchInput__drop-down"
        }
      >
        {searchInputs &&
          searchInputs.map((i, idx) => {
            if (i.isVisited) {
              return (
                <li
                  onMouseMove={() => handleOnMouseMove(idx)}
                  key={i.id}
                  className={
                    idx === activeSeachInput
                      ? "searchInput__drop-down__visited searchInput__active-li"
                      : "searchInput__drop-down__visited"
                  }
                  onClick={onClickInput}
                >
                  <div>
                    <span>
                      {i.userInput.substring(0, numberOfLettersInput)}
                    </span>
                    <span>{i.userInput.substring(numberOfLettersInput)}</span>
                  </div>
                  <button onClick={() => handleDeleteInput(i.userInput)}>
                    Delete
                  </button>
                </li>
              );
            } else {
              return (
                <li
                  onMouseMove={() => handleOnMouseMove(idx)}
                  key={i.id}
                  onClick={onClickInput}
                  className={
                    idx === activeSeachInput ? "searchInput__active-li" : ""
                  }
                >
                  <div>
                    <span>
                      {i.userInput.substring(0, numberOfLettersInput)}
                    </span>
                    <span>{i.userInput.substring(numberOfLettersInput)}</span>
                  </div>
                </li>
              );
            }
          })}
      </ul>
    </form>
  );
};

export default SearchInput;
