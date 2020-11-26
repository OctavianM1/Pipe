import React, { RefObject, useContext, useEffect, useReducer } from "react";
import useCoverImage from "../../Hooks/useCoverImage";
import useProfileCoverPhotoError from "../../Hooks/useProfileCoverPhotoError";
import { VisitorUserContext } from "./UserActivities";

const CommentInput: React.FC<{
  inputRef: RefObject<HTMLDivElement>;
  onKey: (ev: KeyboardEvent) => void;
}> = ({ children, inputRef, onKey }) => {
  const visitorUser = useContext(VisitorUserContext);
  const [inputState, dispatchInput] = useReducer(inputReducer, {
    isInputFocused: false,
    displayPlaceHolder: true,
  });
  const [coverPhotoSrc, setCoverPhotoSrc] = useCoverImage(
    visitorUser.id,
    visitorUser.coverImageExtension
  );

  const profileImgError = useProfileCoverPhotoError(setCoverPhotoSrc);

  useEffect(() => {
    let input = inputRef.current;
    if (inputState.isInputFocused && input) {
      input.addEventListener("keydown", onKey);
    }
    return () => {
      if (input) {
        input.removeEventListener("keydown", onKey);
      }
    };
  }, [inputState.isInputFocused, onKey, inputRef]);

  const onInput = (ev: React.FormEvent<HTMLDivElement>) => {
    if (inputRef.current) {
      if (
        inputRef.current.innerText.length > 0 &&
        inputState.displayPlaceHolder
      ) {
        dispatchInput({ type: "unactive-placeholder" });
      } else if (
        inputRef.current.innerText.length === 0 &&
        !inputState.displayPlaceHolder
      ) {
        dispatchInput({ type: "active-placeholder" });
      }
    }
  };

  const displayPlaceholder =
    !inputRef.current || inputRef.current.innerText.length === 0;

  const styles = children ? { marginLeft: "6%", marginTop: "1rem" } : {};

  return (
    <form
      style={styles}
      className="my-activities__activities-side__activity__add-comment"
    >
      <img onError={profileImgError} src={coverPhotoSrc} alt="anonym user" />
      <div className="my-activities__activities-side__activity__add-comment__container">
        {displayPlaceholder && (
          <div
            className="my-activities__activities-side__activity__add-comment__placeholder"
            onClick={() => inputRef.current?.focus()}
          >
            Write a comment...
          </div>
        )}
        <div
          className="my-activities__activities-side__activity__add-comment__input"
          contentEditable
          ref={inputRef}
          onFocus={() => dispatchInput({ type: "focus" })}
          onBlur={() => dispatchInput({ type: "unfocus" })}
          onInput={onInput}
        />
      </div>
      {children}
    </form>
  );
};

function inputReducer(
  state: {
    isInputFocused: boolean;
    displayPlaceHolder: boolean;
  },
  action: { type: string }
) {
  switch (action.type) {
    case "focus":
      return { ...state, isInputFocused: true };
    case "unfocus":
      return { ...state, isInputFocused: false };
    case "active-placeholder":
      return { ...state, displayPlaceHolder: true };
    case "unactive-placeholder":
      return { ...state, displayPlaceHolder: false };
    default:
      throw new Error(`Invalid type action ${action.type}`);
  }
}

export default CommentInput;
