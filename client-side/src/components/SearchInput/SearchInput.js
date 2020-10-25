import React, { useRef, useState } from "react";
import Loupe from "../Svgs/Loupe";

import "./searchInput.scss";

const SearchInput = ({
  placeholder,
  onSubmit,
  inputs,
  onChangeSearch,
  onClickInput,
  onDeleteInput
}) => {
  const [dislpayDropDown, setDisplayDropDown] = useState(false);
  const inputRef = useRef(null);

  return (
    <form className="searchInput" onSubmit={onSubmit}>
      <div className="searchInput__container">
        <input
          ref={inputRef}
          name="userSearch"
          placeholder={placeholder}
          className="searchInput__input"
          autoComplete="off"
          onFocus={() => setDisplayDropDown(true)}
          onBlur={() => setDisplayDropDown(false)}
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
        {inputs.map((i) => {
          if (i.isVisited) {
            return (
              <li
                key={i.id}
                className="searchInput__drop-down__visited"
                onClick={onClickInput}
              >
                <div>
                  <span>
                    {i.userInput.substring(0, inputRef.current.value.length)}
                  </span>
                  <span>
                    {i.userInput.substring(inputRef.current.value.length)}
                  </span>
                </div>
                <button onClick={() => onDeleteInput(i.userInput)}>
                  Delete
                </button>
              </li>
            );
          } else {
            return (
              <li key={i.id} onClick={onClickInput}>
                <div>
                  <span>
                    {i.userInput.substring(0, inputRef.current.value.length)}
                  </span>
                  <span>
                    {i.userInput.substring(inputRef.current.value.length)}
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

export default SearchInput;
