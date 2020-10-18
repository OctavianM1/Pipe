import React, { useCallback, useEffect, useRef, useState } from "react";

import "./userActivities.scss";

import { Activities } from "../../api/axios";
import { Link } from "react-router-dom";

const Comment = ({
  id,
  activityId,
  visitorUserId,
  userName,
  commentBody,
  commentLikes,
  isLiked,
  commentLikeUsers,
  hostUserId,
  onDeleteComment,
  dateTimeCreated,
  dateTimeEdited,
}) => {
  const [commentLikesNumber, setCommentLikesNumber] = useState(commentLikes);
  const [isLikedComment, setIsLikedComment] = useState(isLiked);
  const [isHoveringCommentLikes, setIsHoveringCommentLikes] = useState(false);
  const [comment, setComment] = useState(commentBody);
  const [displayCommentDate, setDisplayCommentDate] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const cancelEdit = useRef(null);
  const commentInput = useRef(null);

  const userId = JSON.parse(window.localStorage.getItem("user"))["id"];

  const handleOnLikeComment = () => {
    Activities.addLikeToComment({
      userId: visitorUserId,
      activityId: activityId,
      commentId: id,
    })
      .then(() => {
        setCommentLikesNumber(
          isLikedComment ? commentLikesNumber - 1 : commentLikesNumber + 1
        );
        setIsLikedComment(!isLikedComment);
      })
      .catch((err) => console.log(err));
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
        Activities.updateComment({ id: id, commentBody: commentValue })
          .then(() => {
            setComment(commentValue);
          })
          .catch((err) => console.log(err));
      }
      setEditMode(false);
      ev.preventDefault();
    },
    [comment, id]
  );

  useEffect(() => {
    function handleClick(ev) {
      if (editMode) {
        if (commentInput.current && commentInput.current === ev.target) {
          return;
        }
        if (
          (cancelEdit.current && ev.target === cancelEdit.current) ||
          (commentInput.current && commentInput.current.value === comment)
        ) {
          setEditMode(false);
        } else if (commentInput.current && ev.target !== commentInput.current) {
          Activities.updateComment({
            id: id,
            commentBody: commentInput.current.value,
          })
            .then(() => {
              setComment(commentInput.current.value);
              setEditMode(false);
            })
            .catch((err) => console.log(err));
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onEditCommentSubmit, editMode, comment, id]);

  return (
    <div className="comment__container">
      <div className="my-activities__activities-side__activity__comments__comment">
        <img src="/images/activities/anonym.jpg" alt="anonym user" />
        <div
          onMouseEnter={() => setDisplayCommentDate(true)}
          onMouseLeave={() => setDisplayCommentDate(false)}
        >
          <div
            className={
              displayCommentDate
                ? "my-activities__activities-side__activity__comments__comment__display-date my-activities__activities-side__activity__comments__comment__display-date-active"
                : "my-activities__activities-side__activity__comments__comment__display-date"
            }
          >
            <div>Created: {dateTimeCreated}</div>
            <div>Edited: {dateTimeEdited}</div>
          </div>
          <div className="my-activities__activities-side__activity__comments__comment__name">
            <Link to={`/activities/${hostUserId}`}>{userName}</Link>
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
          <button
            className={isLikedComment ? "button-active" : ""}
            onClick={() => handleOnLikeComment()}
          >
            Like
          </button>
          <div
            className="comment-likes"
            onMouseEnter={() => setIsHoveringCommentLikes(true)}
            onMouseLeave={() => setIsHoveringCommentLikes(false)}
          >
            <div
              className={
                isHoveringCommentLikes && commentLikesNumber !== 0
                  ? "my-activities__activities-side__activity__total-raiting__users my-activities__activities-side__activity__total-raiting__users-active"
                  : "my-activities__activities-side__activity__total-raiting__users"
              }
            >
              <div className="my-activities__activities-side__activity__total-raiting__users__arrow">
                &nbsp;
              </div>
              {commentLikeUsers.map((u) => (
                <Link
                  className="my-activities__activities-side__activity__total-raiting__users__user"
                  to={`/activities/${u.id}`}
                  key={u.id}
                >
                  <h3>
                    {u.name}:
                    <span>
                      <img
                        style={{ position: "relative", top: "2px" }}
                        src="/images/activities/blueLike.svg"
                        alt="blue like"
                      />
                    </span>
                  </h3>
                </Link>
              ))}
            </div>
            {isLikedComment ? (
              <img src="/images/activities/blueLike.svg" alt="blue like" />
            ) : (
              <img src="/images/activities/like.svg" alt="like" />
            )}
            <span style={{ color: isLikedComment ? "blue" : "" }}>
              {commentLikesNumber}
            </span>
          </div>
        </div>
      </div>
      {editMode && (
        <div className="comment__edit">
          <img src="/images/activities/check.svg" alt="check" />
          <img
            src="/images/activities/cancel.svg"
            alt="cancel"
            onClick={() => console.log("cancel")}
            ref={cancelEdit}
          />
        </div>
      )}
      {hostUserId === userId && !editMode && (
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
  );
};

export default Comment;
