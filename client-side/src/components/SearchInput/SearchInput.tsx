import React, { useEffect, useRef, useState } from "react";
import "./searchInput.scss";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import Loupe from "../Svgs/Loupe";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import {
  ServerUser,
  ServerSearchInput,
  ServerActivity,
} from "../../api/serverDataInterfaces";

interface SearchInputProps {
  placeholder: string;
  onGetInputs: (matchString?: string) => Promise<ServerSearchInput[]>;
  onSetInput: (input: string | undefined) => Promise<any>;
  onDeleteInput: (input: string) => Promise<any>;
  setUsers:
    | React.Dispatch<React.SetStateAction<ServerUser[]>>
    | React.Dispatch<React.SetStateAction<ServerActivity[]>>;
}

const SearchInput = ({
  placeholder,
  onGetInputs,
  onSetInput,
  onDeleteInput,
  setUsers,
}: SearchInputProps) => {
  const [dislpayDropDown, setDisplayDropDown] = useState(false);
  const [searchInputs, setSearchInputs] = useState<ServerSearchInput[]>([]);
  const [activeSeachInput, setActiveSearchInput] = useState(-1);
  const [numberOfLettersInput, setNumberOfLettersInput] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const error = useApiErrorHandler();

  useEffect(() => {
    onGetInputs().then(setSearchInputs).catch(error);
  }, [onGetInputs, error]);

  const onChangeSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    onGetInputs(val.trim()).then(setSearchInputs).catch(error);
    setNumberOfLettersInput(val.length);
  };

  const onClickInput = (ev: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const evTarget = ev.target as any;
    if (evTarget.className === "delete") return;
    let val = evTarget.innerHTML;
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
    if (inputRef.current) {
      inputRef.current.value = val;
    }
    setDisplayDropDown(false);
    setActiveSearchInput(-1);
  };

  const handleDeleteInput = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    input: string
  ) => {
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
    function onKey(ev: KeyboardEvent) {
      console.log(ev.key);

      console.log(ev.keyCode);
      if (ev.key === "ArrowUp" && activeSeachInput > 0) {
        if (inputRef.current) {
          inputRef.current.value = searchInputs[activeSeachInput - 1].userInput;
        }
        setActiveSearchInput(activeSeachInput - 1);
      } else if (
        ev.key === "ArrowDown" &&
        activeSeachInput < searchInputs.length - 1
      ) {
        if (inputRef.current) {
          inputRef.current.value = searchInputs[activeSeachInput + 1].userInput;
        }
        setActiveSearchInput(activeSeachInput + 1);
      } else if (ev.key === "Enter") {
        if (inputRef.current?.value && inputRef.current?.value.length > 1) {
          onSetInput(inputRef.current?.value).then(setUsers).catch(error);
        }
        setNumberOfLettersInput(0);
        setDisplayDropDown(false);
        setActiveSearchInput(-1);
        inputRef.current?.blur();
      }
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd =
            inputRef.current.value.length;
        }
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

  const handleOnMouseMove = (idx: number) => {
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
          onChange={onChangeSearch}
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
