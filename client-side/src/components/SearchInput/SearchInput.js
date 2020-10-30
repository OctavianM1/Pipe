import React, { useEffect, useRef, useState } from "react";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import Loupe from "../Svgs/Loupe";

import useOutsideAlerter from "../../Hooks/useOutsideAlerter";

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
  const formRef = useRef(null);

  const error = useApiErrorHandler();

  useEffect(() => {
    onGetInputs().then(setSearchInputs).catch(error);
  }, [onGetInputs, error]);

  const onChangeSearch = (ev) => {
    const val = ev.target.value;
    onGetInputs(val.trim()).then(setSearchInputs).catch(error);
    setNumberOfLettersInput(val.length);
  };

  const onClickInput = (ev) => {
    if (ev.target.className === "delete") return;
    let val = ev.target.innerHTML;
    if (val.substring(val.length - 9) === "</button>") {
      val = val.substring(0, val.length - 38);
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
    setDisplayDropDown(false);
    setActiveSearchInput(-1);
  };

  const handleDeleteInput = (ev, input) => {
    onDeleteInput(input)
      .then(() => {
        setSearchInputs((oldInputs) =>
          [...oldInputs].filter((i) => i.userInput !== input)
        );
      })
      .catch(error);
    ev.preventDefault();
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
        setNumberOfLettersInput(0);
        onSetInput(inputRef.current.value).then(setUsers).catch(error);
        setDisplayDropDown(false);
        setActiveSearchInput(-1);
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
  }, [
    dislpayDropDown,
    activeSeachInput,
    searchInputs,
    setUsers,
    error,
    onSetInput,
  ]);

  const handleOnMouseMove = (idx) => {
    setActiveSearchInput(idx);
  };

  useOutsideAlerter(formRef, setDisplayDropDown, null, () =>
    setActiveSearchInput(-1)
  );

  return (
    <form className="searchInput" ref={formRef}>
      <div className="searchInput__container">
        <input
          ref={inputRef}
          name="userSearch"
          placeholder={placeholder}
          className="searchInput__input"
          autoComplete="off"
          onFocus={() => setDisplayDropDown(true)}
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
                  <button
                    className="delete"
                    onClick={(ev) => handleDeleteInput(ev, i.userInput)}
                  >
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

export default React.memo(SearchInput);
