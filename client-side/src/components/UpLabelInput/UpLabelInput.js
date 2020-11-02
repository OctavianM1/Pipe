import React, { useRef } from "react";

import "./upLabelInput.scss";

const UpLabelInput = ({
  handleBlurInput,
  handleFocusInput,
  edit,
  val,
  label,
  labelName,
  logger,
  name,
  loggerText,
  type,
}) => {
  const inputRef = useRef(null);

  if (inputRef && inputRef.current && !logger && !label) {
    inputRef.current.value = "";
  }

  return (
    <div>
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type={type || "text"}
          name={name}
          className="create-activity__container__title"
          onBlur={handleBlurInput}
          onFocus={handleFocusInput}
          defaultValue={edit ? val : ""}
        />
        <span
          className={label ? "input-label input-label-active" : "input-label"}
          onClick={() => inputRef.current.focus()}
        >
          {labelName}
        </span>
      </div>
      {logger && <span className="logger">{loggerText}</span>}
    </div>
  );
};

export default UpLabelInput;
