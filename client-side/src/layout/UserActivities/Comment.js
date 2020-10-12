import React, { useState } from "react";

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
}) => {
  const [commentLikesNumber, setCommentLikesNumber] = useState(commentLikes);
  const [isLikedComment, setIsLikedComment] = useState(isLiked);
  const [isHoveringCommentLikes, setIsHoveringCommentLikes] = useState(false);

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

  return (
    <div className="my-activities__activities-side__activity__comments__comment">
      <img src="/images/activities/anonym.jpg" alt="anonym user" />
      <div>
        <div className="my-activities__activities-side__activity__comments__comment__name">
          {userName}
        </div>
        <div className="my-activities__activities-side__activity__comments__comment__body">
          {commentBody}
        </div>
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
                  {u.name}:{" "}
                  <span>
                    <img style={{position: "relative", top: '2px'}}
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
  );
};

export default Comment;
