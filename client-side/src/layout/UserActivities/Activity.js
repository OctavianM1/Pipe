import React, { useRef, useState } from "react";
import Star from "../../components/Svgs/Star";

import { Activities } from "../../api/axios";
import Comment from "./Comment";

import { Link } from "react-router-dom";

import "./userActivities.scss";
import StarsRaiting from "../../components/StarsRaiting/StarsRaiting";

const Activity = ({
  id,
  title,
  subject,
  body,
  date,
  isLiked,
  likesNumber,
  totalRaiting,
  personalRate,
  hostUserId,
  visitorUserId,
  onRemove,
  comments,
  edit,
}) => {
  const commentInput = useRef(null);

  const [likedActivity, setLikedActivity] = useState(isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState(likesNumber);
  const [rateActivity, setRateActivity] = useState(personalRate);
  const [activityComments, setActivityComments] = useState(comments);
  const [displayedCommentNumber, setDisplayedCommentsNumber] = useState(2);

  const [isHoveringTotalRaiting, setIsHoveringTotalRaiting] = useState(false);

  const handleLikeButton = () => {
    Activities.like({ userId: visitorUserId, activityId: id })
      .then(() => {
        setNumberOfLikes(likedActivity ? numberOfLikes - 1 : numberOfLikes + 1);
        setLikedActivity(!likedActivity);
      })
      .catch((err) => console.log(err));
  };

  const handleRateActivity = (rate) => {
    if (rate === rateActivity) {
      Activities.deleteRate({ userId: visitorUserId, activityId: id })
        .then(() => setRateActivity(0))
        .catch((err) => console.log(err));
    } else {
      console.log(visitorUserId, id, rate);
      Activities.rate({ userId: visitorUserId, activityId: id, rate: rate })
        .then(() => setRateActivity(rate))
        .catch((err) => console.log(err));
    }
  };

  let totalStars = [];
  for (let i = 1; i <= 5; i++) {
    totalStars.push(
      <Star
        key={i}
        color={Math.round(totalRaiting.raiting) >= i ? "#fff220" : "black"}
      />
    );
  }

  const handleSubmitComment = (ev) => {
    const comment = ev.target.commentBody.value;
    if (comment.trim() !== "") {
      Activities.addComment({
        userId: visitorUserId,
        activityId: id,
        commentBody: comment,
      })
        .then((comment) => {
          setActivityComments([comment, ...activityComments]);
          commentInput.current.value = "";
        })
        .catch((err) => console.log(err));
    }
    ev.preventDefault();
  };

  const handleIsLikedComment = (users) => {
    if (!users) {
      return false;
    }
    let isLiked = false;
    users.forEach((u) => {
      if (u.id === visitorUserId) {
        isLiked = true;
      }
    });
    return isLiked;
  };

  const handleEdit = () => {
    console.log("edit");
  };

  let displayedComments = [];
  for (let i = 0; i < displayedCommentNumber; i++) {
    if (activityComments[i]) {
      displayedComments.push(activityComments[i]);
    } else {
      break;
    }
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        {hostUserId === JSON.parse(localStorage.getItem("user"))["id"] && (
          <div className="my-activities__activities-side__activity__editing">
            {edit ? (
              <>
                <img src="/images/activities/check.svg" alt="save" />
                <Link to={`activities/${hostUserId}`}>
                  <img
                    src="/images/activities/delete.svg"
                    alt="delete"
                    onClick={() => onRemove()}
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to={`${hostUserId}/edit/${id}`}>
                  <img
                    src="/images/activities/edit.svg"
                    alt="edit"
                    onClick={handleEdit}
                  />
                </Link>
                <img
                  src="/images/activities/delete.svg"
                  alt="delete"
                  onClick={() => onRemove()}
                />
              </>
            )}
          </div>
        )}
        <div className="my-activities__activities-side__activity">
          <div className="my-activities__activities-side__activity__total-raiting__container">
            <div
              className="my-activities__activities-side__activity__total-raiting"
              onMouseEnter={() => setIsHoveringTotalRaiting(true)}
              onMouseLeave={() => setIsHoveringTotalRaiting(false)}
            >
              <div
                className={
                  isHoveringTotalRaiting && totalRaiting.raiting !== 0
                    ? "my-activities__activities-side__activity__total-raiting__users my-activities__activities-side__activity__total-raiting__users-active"
                    : "my-activities__activities-side__activity__total-raiting__users"
                }
              >
                <div className="my-activities__activities-side__activity__total-raiting__users__arrow">
                  &nbsp;
                </div>
                {totalRaiting.users.map((u) => (
                  <Link
                    className="my-activities__activities-side__activity__total-raiting__users__user"
                    to={`/activities/${u.id}`}
                    key={u.id}
                  >
                    <h3>
                      {u.name}: <span>{u.rate}</span>
                    </h3>
                    <Star color="yellow" />
                  </Link>
                ))}
              </div>
              <h3>Total raiting:</h3>
              <div>{totalStars}</div>
            </div>
            <div className="my-activities__activities-side__activity__personal-raiting">
              <h3>Your raiting:</h3>
              <StarsRaiting
                initialState={rateActivity}
                handleStarClick={handleRateActivity}
              />
            </div>
          </div>
          <div className="my-activities__activities-side__activity__title">
            {title}
          </div>
          <div className="my-activities__activities-side__activity__subject">
            {subject}
          </div>
          <div className="my-activities__activities-side__activity__body">
            {body}
          </div>
          <div className="my-activities__activities-side__activity__date">
            {date}
          </div>
          <div className="my-activities__activities-side__activity__buttons">
            <button onClick={() => handleLikeButton()}>
              {likedActivity ? (
                <img src="/images/activities/blueLike.svg" alt="blue like" />
              ) : (
                <img src="/images/activities/like.svg" alt="like" />
              )}
              <div
                className={
                  likedActivity
                    ? "my-activities__activities-side__activity__buttons__like"
                    : ""
                }
              >
                Like ({numberOfLikes})
              </div>
              <span>&nbsp;</span>
            </button>
            <button onClick={() => commentInput.current.focus()}>
              <img src="/images/activities/comment.svg" alt="comment" />
              Comment<span>&nbsp;</span>
            </button>
          </div>
          <div className="my-activities__activities-side__activity__comments">
            {displayedComments.map((c) => (
              <Comment
                key={c.id}
                userName={c.user.name}
                commentBody={c.comment}
                commentLikes={c.commentLikeUsers.length}
                id={c.id}
                visitorUserId={visitorUserId}
                activityId={id}
                isLiked={() => handleIsLikedComment(c.commentLikeUsers)}
                commentLikeUsers={c.commentLikeUsers}
              />
            ))}
            {displayedCommentNumber < activityComments.length ? (
              <button
                className="my-activities__activities-side__activity__comments__show-more"
                onClick={() =>
                  setDisplayedCommentsNumber(displayedCommentNumber * 2)
                }
              >
                Show more ({activityComments.length - displayedCommentNumber})
              </button>
            ) : (
              <button
                className="my-activities__activities-side__activity__comments__show-more"
                onClick={() => setDisplayedCommentsNumber(2)}
              >
                {activityComments.length > 2 ? "Show less" : ""}
              </button>
            )}
            <form
              className="my-activities__activities-side__activity__add-comment"
              onSubmit={handleSubmitComment}
            >
              <img src="/images/activities/anonym.jpg" alt="anonym user" />
              <input
                ref={commentInput}
                type="text"
                name="commentBody"
                placeholder="Write a comment..."
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Activity;
