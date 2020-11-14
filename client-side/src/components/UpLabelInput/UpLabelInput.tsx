import React, { useRef, FocusEvent } from "react";

import "./upLabelInput.scss";

interface UpLabelInputProps {
  handleBlurInput:
    | ((event: FocusEvent<HTMLInputElement>) => void)
    | undefined;
  handleFocusInput:
    | ((event: FocusEvent<HTMLInputElement>) => void)
    | undefined;
  edit: boolean;
  val: string | undefined;
  label: boolean | undefined;
  labelName: string;
  logger: boolean;
  name: string;
  loggerText: string;
  type: string;
}

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
}: Partial<UpLabelInputProps>) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
          onClick={() => inputRef.current?.focus()}
        >
          {labelName}
        </span>
      </div>
      {logger && <span className="logger">{loggerText}</span>}
    </div>
  );
};

export default UpLabelInput;
