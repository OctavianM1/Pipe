import React, {
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "emoji-mart/css/emoji-mart.css";
import useCoverImage from "../../../Hooks/useCoverImage";
import useProfileCoverPhotoError from "../../../Hooks/useProfileCoverPhotoError";
import { VisitorUserContext } from "../UserActivities";
import { EmojiData, Picker } from "emoji-mart";
import { CSSTransition } from "react-transition-group";
import useOutsideAlerter from "../../../Hooks/useOutsideAlerter";

const CommentInput: React.FC<{
  children?: ReactNode;
  inputRef: RefObject<HTMLDivElement>;
  onKey: (ev: KeyboardEvent) => void;
}> = ({ children, inputRef, onKey }) => {
  const visitorUser = useContext(VisitorUserContext);
  const [inputState, dispatchInput] = useReducer(inputReducer, {
    isInputFocused: false,
    displayPlaceHolder: true,
    caretPos: 0,
    row: 0,
  });
  const [selectEmoji, setSelectEmoji] = useState(false);
  const [coverPhotoSrc, setCoverPhotoSrc] = useCoverImage(
    visitorUser.id,
    visitorUser.coverImageExtension
  );
  const emojiRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(
    emojiRef,
    selectEmoji,
    useCallback(() => setSelectEmoji(false), []),
    "emoj"
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

  const addEmoji = (emoji: EmojiData) => {
    if (inputRef.current) {
      const rows = inputRef.current.innerHTML
        .replace("&nbsp;", " ")
        .split("<br>");
      const { row, caretPos } = inputState;
      rows[row] =
        rows[row].substring(0, caretPos) +
        (emoji as any).native +
        rows[row].substring(caretPos);
      inputRef.current.innerHTML = rows.join("<br>");
      dispatchInput({ type: "add-emoji" });
    }
  };

  const displayPlaceholder =
    !inputRef.current || inputRef.current.innerText.length === 0;

  const styles = children ? { marginLeft: "6%", marginTop: "1rem" } : {};

  const onBlurInput = () => {
    const { caretPos, row } = getCaretPosition(inputRef.current);
    dispatchInput({ type: "blur", caretPos, row });
  };

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
        <div>
          <div
            className="my-activities__activities-side__activity__add-comment__input"
            contentEditable
            ref={inputRef}
            onFocus={() => dispatchInput({ type: "focus" })}
            onBlur={onBlurInput}
            onInput={onInput}
            suppressContentEditableWarning={true}
          />
          <div className="my-activities__activities-side__activity__add-comment__emoji emoj">
            <img
              className="emoj"
              src="/images/activities/smile.svg"
              alt="smile"
              onClick={() => setSelectEmoji(!selectEmoji)}
            />
            <span>&nbsp;</span>
          </div>
          <CSSTransition
            in={selectEmoji}
            unmountOnExit
            timeout={250}
            classNames="emoji"
          >
            <div
              className="my-activities__activities-side__activity__add-comment__select-emoji"
              ref={emojiRef}
            >
              <Picker onSelect={addEmoji} />
            </div>
          </CSSTransition>
        </div>
      </div>
      {children}
    </form>
  );
};

function inputReducer(
  state: {
    isInputFocused: boolean;
    displayPlaceHolder: boolean;
    caretPos: number;
    row: number;
  },
  action: { type: string; row?: number; caretPos?: number }
) {
  switch (action.type) {
    case "focus":
      return { ...state, isInputFocused: true };
    case "blur":
      if (action.row === undefined || action.caretPos === undefined)
        return { ...state, isInputFocused: false };
      return {
        ...state,
        isInputFocused: false,
        caretPos: action.caretPos,
        row: action.row,
      };
    case "active-placeholder":
      return { ...state, displayPlaceHolder: true };
    case "unactive-placeholder":
      return { ...state, displayPlaceHolder: false };
    case "add-emoji":
      return { ...state, caretPos: state.caretPos + 2 };
    default:
      throw new Error(`Invalid type action ${action.type}`);
  }
}

function getCaretPosition(editableDiv: any) {
  let caretPos = 0;
  let sel;
  let range;
  let prevSibling;
  let row = 0;
  sel = window.getSelection();
  if (sel && sel.rangeCount) {
    range = sel.getRangeAt(0);
    prevSibling = range.startContainer as any;
    while (prevSibling.previousElementSibling) {
      prevSibling = prevSibling.previousElementSibling;
      row++;
    }
    if (range.commonAncestorContainer.parentNode === editableDiv) {
      caretPos = range.endOffset;
    }
  }
  return { caretPos, row };
}

export default React.memo(CommentInput);
