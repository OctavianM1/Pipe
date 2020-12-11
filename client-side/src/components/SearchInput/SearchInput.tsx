import React, { useCallback, useReducer, useRef, useState } from "react";
import "./searchInput.scss";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import Loupe from "../Svgs/Loupe";
import useOutsideAlerter from "../../Hooks/useOutsideAlerter";
import {
  ServerUser,
  ServerSearchInput,
  ServerActivity,
} from "../../api/serverDataInterfaces";
import useReplaceHash from "../../Hooks/useReplaceHash";
import { useLocation } from "react-router-dom";
import useHash from "../../Hooks/useHash";
import useIsMounted from "../../Hooks/useIsMounted";

interface SearchInputProps {
  placeholder: string;
  onGetInputs: (matchString?: string) => Promise<ServerSearchInput[]>;
  onSetInput: (input: string) => Promise<any>;
  onDeleteInput: (input: string) => Promise<any>;
  setUsers:
    | React.Dispatch<React.SetStateAction<ServerUser[]>>
    | React.Dispatch<React.SetStateAction<ServerActivity[]>>;
  defaultValue?: string | undefined;
}

const SearchInput = ({
  placeholder,
  onGetInputs,
  onSetInput,
  onDeleteInput,
  setUsers,
  defaultValue,
}: SearchInputProps) => {
  const isMounted = useIsMounted();
  const [input, dispatchInput] = useReducer(inputReducer, {
    dislpayDropDown: false,
    activeSeachInput: -1,
    numberOfLettersInput: 0,
  });
  const [searchInputs, setSearchInputs] = useState<ServerSearchInput[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const error = useApiErrorHandler();

  const { hash } = useLocation();
  const hashObj = useHash();
  const replaceHash = useReplaceHash();

  const onChangeSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    onGetInputs(val.trim()).then(setSearchInputs).catch(error);
    dispatchInput({ type: "set letters", length: val.length });
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
    replaceHash(hash, `&search=${hashObj["search"]}`, `&search=${val}`);

    if (inputRef.current) {
      inputRef.current.value = val;
    }
    dispatchInput({ type: "init" });
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

  const handleOnMouseMove = (idx: number) => {
    dispatchInput({ type: "set active", length: idx });
  };

  useOutsideAlerter(
    formRef,
    input.dislpayDropDown,
    useCallback(() => dispatchInput({ type: "no active" }), [])
  );

  const onKeyDownSearch = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "ArrowUp" && input.activeSeachInput > 0) {
      if (inputRef.current) {
        inputRef.current.value =
          searchInputs[input.activeSeachInput - 1].userInput;
      }
      dispatchInput({
        type: "set active",
        length: input.activeSeachInput - 1,
      });
    } else if (
      ev.key === "ArrowDown" &&
      input.activeSeachInput < searchInputs.length - 1
    ) {
      if (inputRef.current) {
        inputRef.current.value =
          searchInputs[input.activeSeachInput + 1].userInput;
      }
      dispatchInput({
        type: "set active",
        length: input.activeSeachInput + 1,
      });
    } else if (ev.key === "Enter") {
      if (inputRef.current?.value && inputRef.current?.value.length > 1) {
        onSetInput(inputRef.current?.value).then(setUsers).catch(error);
        replaceHash(
          hash,
          `&search=${hashObj["search"]}`,
          `&search=${inputRef.current?.value}`
        );
      }
      dispatchInput({ type: "init" });
      inputRef.current?.blur();
    }
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          inputRef.current.value.length;
      }
    }, 0);
  };

  const onFocus = () => {
    dispatchInput({ type: "open" });
    if (!searchInputs.length) {
      onGetInputs()
        .then((searchInputs) => {
          if (isMounted.current) {
            setSearchInputs(searchInputs);
          }
        })
        .catch(error);
    }
  };

  return (
    <form className="searchInput" ref={formRef}>
      <div className="searchInput__container">
        <input
          ref={inputRef}
          name="userSearch"
          placeholder={placeholder}
          className="searchInput__input"
          autoComplete="off"
          onFocus={onFocus}
          onChange={onChangeSearch}
          onKeyDown={onKeyDownSearch}
          defaultValue={defaultValue}
        />
        <button className="searchInput__back">
          <Loupe />
          <span>&nbsp;</span>
        </button>
      </div>
      <ul
        className={
          input.dislpayDropDown
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
                    idx === input.activeSeachInput
                      ? "searchInput__drop-down__visited searchInput__active-li"
                      : "searchInput__drop-down__visited"
                  }
                  onClick={onClickInput}
                >
                  <div>
                    <span>
                      {i.userInput.substring(0, input.numberOfLettersInput)}
                    </span>
                    <span>
                      {i.userInput.substring(input.numberOfLettersInput)}
                    </span>
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
                    idx === input.activeSeachInput
                      ? "searchInput__active-li"
                      : ""
                  }
                >
                  <div>
                    <span>
                      {i.userInput.substring(0, input.numberOfLettersInput)}
                    </span>
                    <span>
                      {i.userInput.substring(input.numberOfLettersInput)}
                    </span>
                  </div>
                </li>
              );
            }
          })}
      </ul>
    </form>
  );
};

function inputReducer(
  state: {
    dislpayDropDown: boolean;
    activeSeachInput: number;
    numberOfLettersInput: number;
  },
  action: { type: string; length?: number }
) {
  switch (action.type) {
    case "set active":
      if (action.length === undefined) throw new Error("Invalid length");
      return { ...state, activeSeachInput: action.length };
    case "set letters":
      if (action.length === undefined) throw new Error("Invalid length");
      return { ...state, numberOfLettersInput: action.length };
    case "init":
      return {
        numberOfLettersInput: 0,
        dislpayDropDown: false,
        activeSeachInput: -1,
      };
    case "open": {
      return { ...state, dislpayDropDown: true };
    }
    case "no active": {
      return { ...state, dislpayDropDown: false, activeSeachInput: -1 };
    }
    default:
      throw new Error("Invalid action");
  }
}

export default React.memo(SearchInput);
