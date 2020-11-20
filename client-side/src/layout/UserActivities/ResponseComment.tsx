import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { Activities } from "../../api/axios";
import {
  ServerActivityCommentResponse,
  ServerUser,
} from "../../api/serverDataInterfaces";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import UserCommentLike from "./UserCommentLike";

const ResponseComment = ({
  id,
  parentActivityCommentId,
  comment,
  commentResponseLikes,
  user,
  coverPhotoSrc,
  profileImgError,
  activityRef,
  onClickRespond,
  visitorUser,
  setCommentResponses,
  setNumberOfResponses,
}: ServerActivityCommentResponse & {
  coverPhotoSrc: string;
  profileImgError: (ev: SyntheticEvent<HTMLImageElement, Event>) => void;
  activityRef: RefObject<HTMLDivElement>;
  onClickRespond: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  visitorUser: ServerUser;
  setCommentResponses: Dispatch<
    SetStateAction<ServerActivityCommentResponse[]>
  >;
  setNumberOfResponses: Dispatch<SetStateAction<number>>;
}) => {
  const [responseLikes, setResponseLike] = useState(commentResponseLikes);
  const [editMode, setEditMode] = useState(false);
  const [isLikedComment, setIsLikedComment] = useState(getIsLikedComment());
  const [hoveringCommentLikes, setHoveringCommentLikes] = useState({
    hover: false,
    part: 1, // 1 to right, 2 to left
  });
  const [commentBody, setCommentBody] = useState(comment);

  const commentInput = useRef<HTMLInputElement>(null);
  const commentLikeRef = useRef<HTMLInputElement>(null);
  const cancelEdit = useRef<HTMLImageElement>(null);

  const commentLikesDisplayedUsers = useMemo(() => {
    const arr: ServerUser[] = [];
    for (let i = 0; i < 10 && responseLikes && responseLikes[i]; i++) {
      arr.push(responseLikes[i]);
    }
    return arr;
  }, [responseLikes]);

  const error = useApiErrorHandler();

  function getIsLikedComment() {
    for (let i = 0; responseLikes && i < responseLikes.length; i++) {
      if (responseLikes[i].id === user.id) {
        return true;
      }
    }
    return false;
  }

  const handleHoverCommentLike = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const activityRight = activityRef?.current?.getBoundingClientRect().right!;
    const likeContainerRight = commentLikeRef?.current?.getBoundingClientRect()
      .right!;
    if (likeContainerRight + 300 < activityRight) {
      setHoveringCommentLikes({ hover: true, part: 1 });
    } else {
      setHoveringCommentLikes({ hover: true, part: 2 });
    }
  };

  const onDeleteComment = (
    ev: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    Activities.deleteCommentResponse(id)
      .then(() =>
        setCommentResponses((oldResponses) =>
          [...oldResponses].filter((r) => r.id !== id)
        )
      )
      .catch(error);
  };

  const handleOnLikeComment = () => {
    Activities.addLikeCommentResponse({
      userId: user.id,
      commentResponseId: id,
    })
      .then((newUserLike) => {
        setResponseLike((oldResponses) => [...oldResponses, newUserLike]);
        setIsLikedComment((liked) => !liked);
      })
      .catch(error);
  };

  const onEditCommentSubmit = useCallback(
    (ev) => {
      const commentValue = commentInput.current?.value || "";
      if (commentValue.trim() !== "" && commentValue !== commentBody) {
        Activities.updateCommentResponse({
          responseCommentId: id,
          newCommentBody: commentValue,
        })
          .then((comment) => {
            setCommentBody(comment);
            setEditMode(false);
          })
          .catch(error);
      }
      ev.preventDefault();
    },
    [commentBody, error, id]
  );

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      if (editMode) {
        if (commentInput.current && commentInput.current === ev.target) {
          return;
        }
        if (
          (cancelEdit.current && ev.target === cancelEdit.current) ||
          commentInput?.current?.value === commentBody
        ) {
          setEditMode(false);
        } else if (commentInput.current && ev.target !== commentInput.current) {
          Activities.updateCommentResponse({
            responseCommentId: id,
            newCommentBody: commentInput.current.value,
          })
            .then((comment) => {
              setCommentBody(comment);
              setEditMode(false);
            })
            .catch(error);
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onEditCommentSubmit, editMode, commentBody, id, error]);

  return (
    <>
      <div className="comment__container" style={{ marginLeft: "6%" }}>
        <div
          className={
            editMode
              ? "my-activities__activities-side__activity__comments__comment comment__container__full-width"
              : "my-activities__activities-side__activity__comments__comment"
          }
        >
          <img
            onError={profileImgError}
            src={coverPhotoSrc}
            alt="anonym user"
          />
          <div className={editMode ? "comment__container__full-width" : ""}>
            <div className="my-activities__activities-side__activity__comments__comment__name">
              <Link to={`/activities/${user.id}`}>{user.name}</Link>
            </div>
            {editMode ? (
              <form
                className="comment__edit__form"
                onSubmit={onEditCommentSubmit}
              >
                <input
                  ref={commentInput}
                  className="comment__edit__input"
                  name="edit-response-input"
                  defaultValue={commentBody}
                  autoFocus
                />
                <span className="comment__edit__input__border">&nbsp;</span>
              </form>
            ) : (
              <div className="my-activities__activities-side__activity__comments__comment__body">
                {commentBody}
              </div>
            )}
            <div
              className="comment-likes"
              ref={commentLikeRef}
              onMouseEnter={handleHoverCommentLike}
              onMouseLeave={() =>
                setHoveringCommentLikes({
                  hover: false,
                  part: hoveringCommentLikes.part,
                })
              }
            >
              <div
                className={
                  hoveringCommentLikes.hover &&
                  responseLikes &&
                  responseLikes.length !== 0
                    ? `comment__likes__users-${hoveringCommentLikes.part} comment__likes__users-active-${hoveringCommentLikes.part}`
                    : `comment__likes__users-${hoveringCommentLikes.part}`
                }
              >
                <div
                  className={`comment__likes__users__arrow-${hoveringCommentLikes.part}`}
                >
                  &nbsp;
                </div>
                {commentLikesDisplayedUsers.map((u) => (
                  <UserCommentLike key={u.id} user={u} />
                ))}
              </div>
              <div className="comment-likes__container">
                <div className="comment-likes__container__img-container">
                  <img src="/images/activities/fb-like.svg" alt="like" />
                </div>
                <span style={{ color: isLikedComment ? "blue" : "" }}>
                  {responseLikes ? responseLikes.length : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
        {editMode && (
          <div className="comment__edit">
            <img src="/images/activities/check.svg" alt="check" />
            <img
              src="/images/activities/cancel.svg"
              alt="cancel"
              ref={cancelEdit}
            />
          </div>
        )}
        {user.id === visitorUser.id && !editMode && (
          <div className="comment__edit">
            <img
              src="/images/activities/edit.svg"
              alt="edit"
              onClick={() => setEditMode(true)}
            />
            <img
              src="/images/activities/delete.svg"
              alt="delete"
              onClick={onDeleteComment}
            />
          </div>
        )}
      </div>
      <div className="c__buttons" style={{ marginLeft: "13%" }}>
        {isLikedComment ? (
          <button
            className="c__buttons__button-like c__buttons__button-like-active"
            onClick={() => handleOnLikeComment()}
          >
            UnLike
          </button>
        ) : (
          <button
            className="c__buttons__button-like"
            onClick={() => handleOnLikeComment()}
          >
            Like
          </button>
        )}
        <span>&nbsp;·&nbsp;</span>
        <button className="c__buttons__button-respond" onClick={onClickRespond}>
          Respond
        </button>
      </div>
    </>
  );
};

export default ResponseComment;
