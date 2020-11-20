import React, {
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./userActivities.scss";

import { Activities } from "../../api/axios";
import { Link } from "react-router-dom";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import {
  ServerActivityComment,
  ServerActivityCommentResponse,
  ServerUser,
} from "../../api/serverDataInterfaces";
import useProfileCoverPhotoError from "../../Hooks/useProfileCoverPhotoError";
import UserCommentLike from "./UserCommentLike";
import ResponseComment from "./ResponseComment";

interface CommentProps {
  activityId: string;
  visitorUser: ServerUser;
  isLiked: boolean;
  onDeleteComment: () => void;
  activityRef: RefObject<HTMLDivElement>;
  commentData: ServerActivityComment;
}

const Comment = ({
  activityId,
  visitorUser,
  isLiked,
  onDeleteComment,
  activityRef,
  commentData,
}: CommentProps) => {
  const [commentLikesNumber, setCommentLikesNumber] = useState(
    commentData.commentLikeUsers.length
  );
  const [isLikedComment, setIsLikedComment] = useState(isLiked);
  const [hoveringCommentLikes, setHoveringCommentLikes] = useState({
    hover: false,
    part: 1, // 1 to right, 2 to left
  });
  const [comment, setComment] = useState(commentData.comment);
  const [displayCommentDate, setDisplayCommentDate] = useState(false);
  const [commentLikesDisplayedUsers, setCommentLikesDisplayedUsers] = useState(
    commentData.commentLikeUsers
  );
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(
    commentData.user.coverImageExtension
      ? `/images/userPhotos/${commentData.user.id}.${commentData.user.coverImageExtension}`
      : "/images/userPhotos/anonym.jpg"
  );
  const [coverPhotoVisitorSrc, setCoverPhotoVisitorSrc] = useState(
    commentData.user.coverImageExtension
      ? `/images/userPhotos/${visitorUser.id}.${visitorUser.coverImageExtension}`
      : "/images/userPhotos/anonym.jpg"
  );
  const [respondCommentInputMode, setRespondCommentInputMode] = useState(false);
  const [commentResponses, setCommentResponses] = useState<
    ServerActivityCommentResponse[]
  >([]);
  const [numberOfResponses, setNumberOfResponses] = useState(
    commentData.numberOfResponses || 0
  );

  const [editMode, setEditMode] = useState(false);
  const cancelEdit = useRef<HTMLImageElement>(null);
  const commentInput = useRef<HTMLInputElement>(null);
  const commentLikeRef = useRef<HTMLDivElement>(null);
  const responseCommentInputRef = useRef<HTMLInputElement>(null);

  const error = useApiErrorHandler();

  const handleOnLikeComment = () => {
    Activities.addLikeToComment({
      userId: visitorUser.id,
      activityId: activityId,
      commentId: commentData.id,
    })
      .then(() => {
        if (isLikedComment) {
          setCommentLikesNumber(commentLikesNumber - 1);
          setCommentLikesDisplayedUsers(
            commentLikesDisplayedUsers.filter((c) => c.id !== visitorUser.id)
          );
        } else {
          setCommentLikesNumber(commentLikesNumber + 1);
          setCommentLikesDisplayedUsers([
            ...commentLikesDisplayedUsers,
            { ...visitorUser },
          ]);
        }
        setIsLikedComment(!isLikedComment);
      })
      .catch(error);
  };

  const onEditCommentSubmit = useCallback(
    (ev) => {
      let commentValue = "";
      if (ev.target["edit-input"]) {
        commentValue = ev.target["edit-input"].value;
      } else {
        commentValue = ev.target.value;
      }
      if (commentValue.trim() !== "" && commentValue !== comment) {
        Activities.updateComment({
          id: commentData.id,
          commentBody: commentValue,
        })
          .then(() => {
            setComment(commentValue);
          })
          .catch(error);
      }
      setEditMode(false);
      ev.preventDefault();
    },
    [comment, commentData.id, error]
  );

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      if (editMode) {
        if (commentInput.current && commentInput.current === ev.target) {
          return;
        }
        if (
          (cancelEdit.current && ev.target === cancelEdit.current) ||
          commentInput?.current?.value === comment
        ) {
          setEditMode(false);
        } else if (commentInput.current && ev.target !== commentInput.current) {
          Activities.updateComment({
            id: commentData.id,
            commentBody: commentInput.current.value,
          })
            .then(() => {
              if (commentInput.current) {
                setComment(commentInput.current.value);
              }
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
  }, [onEditCommentSubmit, editMode, comment, commentData.id, error]);

  const handleHoverCommentLike = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setDisplayCommentDate(false);
    const activityRight = activityRef?.current?.getBoundingClientRect().right!;
    const likeContainerRight = commentLikeRef?.current?.getBoundingClientRect()
      .right!;
    if (likeContainerRight + 300 < activityRight) {
      setHoveringCommentLikes({ hover: true, part: 1 });
    } else {
      setHoveringCommentLikes({ hover: true, part: 2 });
    }
  };

  const profileImgError = useProfileCoverPhotoError(setCoverPhotoSrc);
  const profileVisitorImgError = useProfileCoverPhotoError(
    setCoverPhotoVisitorSrc
  );

  const onClickRespond = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setRespondCommentInputMode(true);
    setTimeout(() => {
      responseCommentInputRef.current?.focus();
    }, 40);
  };

  const handleSubmitAddComment = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (
      responseCommentInputRef.current?.value &&
      responseCommentInputRef.current.value.length > 0
    ) {
      Activities.addCommentResponse({
        parentActivityCommentId: commentData.id,
        userId: visitorUser.id,
        comment: responseCommentInputRef.current.value,
      })
        .then((responses) => {
          setRespondCommentInputMode(false);
          setCommentResponses(responses);
        })
        .catch(error);
    }
  };

  const showCommentResponses = (
    ev?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    Activities.getCommentResponses(commentData.id)
      .then(setCommentResponses)
      .catch(error);
  };

  return (
    <>
      <div className="comment__container">
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
          <div
            onMouseEnter={() => setDisplayCommentDate(true)}
            onMouseLeave={() => setDisplayCommentDate(false)}
            className={editMode ? "comment__container__full-width" : ""}
          >
            <div
              className={
                displayCommentDate
                  ? "my-activities__activities-side__activity__comments__comment__display-date my-activities__activities-side__activity__comments__comment__display-date-active"
                  : "my-activities__activities-side__activity__comments__comment__display-date"
              }
            >
              <div>Created: {commentData.dateTimeCreated}</div>
              <div>Edited: {commentData.dateTimeEdited}</div>
            </div>
            <div className="my-activities__activities-side__activity__comments__comment__name">
              <Link to={`/activities/${commentData.user.id}`}>
                {commentData.user.name}
              </Link>
            </div>
            {editMode ? (
              <form
                className="comment__edit__form"
                onSubmit={onEditCommentSubmit}
              >
                <input
                  ref={commentInput}
                  className="comment__edit__input"
                  name="edit-input"
                  defaultValue={comment}
                  autoFocus
                />
                <span className="comment__edit__input__border">&nbsp;</span>
              </form>
            ) : (
              <div className="my-activities__activities-side__activity__comments__comment__body">
                {comment}
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
                  hoveringCommentLikes.hover && commentLikesNumber !== 0
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
                  {commentLikesNumber}
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
        {visitorUser && commentData.user.id === visitorUser.id && !editMode && (
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
      <div className="c__buttons">
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
      {numberOfResponses > 0 && commentResponses.length === 0 && (
        <div
          className="comment__number-of-responses"
          onClick={showCommentResponses}
        >
          <img src="/images/activities/right-arrow.svg" alt="right arrow" />
          <span>
            {`${numberOfResponses} ${
              numberOfResponses === 1 ? "user" : "users"
            } replied`}
          </span>
        </div>
      )}
      {commentResponses.length > 0 &&
        commentResponses.map((c) => (
          <ResponseComment
            key={c.id}
            id={c.id}
            comment={c.comment}
            commentResponseLikes={c.commentResponseLikes}
            parentActivityCommentId={c.parentActivityCommentId}
            user={c.user}
            visitorUser={visitorUser}
            coverPhotoSrc={coverPhotoVisitorSrc}
            profileImgError={profileImgError}
            activityRef={activityRef}
            onClickRespond={onClickRespond}
            setCommentResponses={setCommentResponses}
            setNumberOfResponses={setNumberOfResponses}
          />
        ))}
      {respondCommentInputMode && (
        <form
          style={{ marginLeft: "6%", marginTop: "1rem" }}
          className="my-activities__activities-side__activity__add-comment"
          onSubmit={handleSubmitAddComment}
        >
          <img
            onError={profileVisitorImgError}
            src={coverPhotoVisitorSrc}
            alt="anonym user"
          />
          <input
            type="text"
            name="responseCommentBody"
            placeholder="Respond to comment..."
            defaultValue={`${commentData.user.name} `}
            ref={responseCommentInputRef}
          />
          <img
            id="button-remove-respond-comment"
            src="/images/activities/cancel.svg"
            alt="delete"
            onClick={() => setRespondCommentInputMode(false)}
          />
        </form>
      )}
    </>
  );
};

export default Comment;
