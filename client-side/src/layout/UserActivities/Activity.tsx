import React, { FormEvent, useRef, useState } from "react";
import Star from "../../components/Svgs/Star";

import { Activities } from "../../api/axios";
import Comment from "./Comment";

import { Link } from "react-router-dom";

import "./userActivities.scss";
import StarsRaiting from "../../components/StarsRaiting/StarsRaiting";
import useApiErrorHandler from "../../Hooks/useApiErrorHandler";
import {
  ServerUser,
  ServerActivityComment,
  ServerActivityRaiting,
} from "../../api/serverDataInterfaces";

interface ActivityProps {
  id: string;
  title: string;
  subject: string;
  body: string;
  date: string;
  isLiked: boolean;
  likesNumber: number;
  totalRaiting: ServerActivityRaiting;
  personalRate: number;
  hostUserId: string;
  visitorUser: ServerUser;
  onRemove: () => void;
  comments: ServerActivityComment[];
}

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
  visitorUser,
  onRemove,
  comments,
}: ActivityProps) => {
  const commentInput = useRef<HTMLInputElement>(null);

  const [likedActivity, setLikedActivity] = useState(isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState(likesNumber);
  const [rateActivity, setRateActivity] = useState(personalRate);
  const [activityComments, setActivityComments] = useState(comments);
  const [displayedCommentNumber, setDisplayedCommentsNumber] = useState(2);

  const [isHoveringTotalRaiting, setIsHoveringTotalRaiting] = useState(false);

  const activityRef = useRef<HTMLDivElement>(null);

  const error = useApiErrorHandler();

  const handleLikeButton = () => {
    Activities.like({ userId: visitorUser.id, activityId: id })
      .then(() => {
        setNumberOfLikes(likedActivity ? numberOfLikes - 1 : numberOfLikes + 1);
        setLikedActivity(!likedActivity);
      })
      .catch(error);
  };

  const handleRateActivity = (rate: number) => {
    if (rate === rateActivity) {
      Activities.deleteRate({ userId: visitorUser.id, activityId: id })
        .then(() => setRateActivity(0))
        .catch(error);
    } else {
      Activities.rate({ userId: visitorUser.id, activityId: id, rate: rate })
        .then(() => setRateActivity(rate))
        .catch(error);
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

  const handleSubmitComment = (ev: FormEvent<HTMLFormElement>) => {
    const target = ev.target as any;
    const comment = target.commentBody.value;
    if (comment.trim() !== "") {
      Activities.addComment({
        userId: visitorUser.id,
        activityId: id,
        commentBody: comment,
      })
        .then((comment: ServerActivityComment) => {
          setActivityComments([comment, ...activityComments]);
          if (commentInput.current) {
            commentInput.current.value = "";
          }
        })
        .catch(error);
    }
    ev.preventDefault();
  };

  const handleIsLikedComment = (users: ServerUser[]): boolean => {
    if (!users) {
      return false;
    }
    let isLiked = false;
    users.forEach((u) => {
      if (u.id === visitorUser.id) {
        isLiked = true;
      }
    });

    return isLiked;
  };

  let displayedComments = [];
  for (let i = 0; i < displayedCommentNumber; i++) {
    if (activityComments[i]) {
      displayedComments.push(activityComments[i]);
    } else {
      break;
    }
  }

  const handleDeleteComment = (id: string) => {
    Activities.deleteComment(id)
      .then(() => {
        setActivityComments([...activityComments].filter((c) => c.id !== id));
      })
      .catch(error);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        {hostUserId ===
          JSON.parse(localStorage.getItem("user") || "{}")["id"] && (
          <div className="my-activities__activities-side__activity__editing">
            <Link to={`${hostUserId}/edit/${id}`}>
              <img src="/images/activities/edit.svg" alt="edit" />
            </Link>
            <img
              src="/images/activities/delete.svg"
              alt="delete"
              onClick={() => onRemove()}
            />
          </div>
        )}
        <div
          ref={activityRef}
          className="my-activities__activities-side__activity"
        >
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
              {likedActivity ? (
                <div className="my-activities__activities-side__activity__buttons__like">
                  UnLike ({numberOfLikes})
                </div>
              ) : (
                <div>Like ({numberOfLikes})</div>
              )}
              <span>&nbsp;</span>
            </button>
            <button onClick={() => commentInput?.current?.focus()}>
              <img src="/images/activities/comment.svg" alt="comment" />
              Comment<span>&nbsp;</span>
            </button>
          </div>
          <div className="my-activities__activities-side__activity__comments">
            {displayedComments.map((c) => (
              <Comment
                key={c.id}
                hostUserId={c.user.id}
                userName={c.user.name}
                commentBody={c.comment}
                commentLikes={c.commentLikeUsers.length}
                id={c.id}
                visitorUser={visitorUser}
                activityId={id}
                isLiked={handleIsLikedComment(c.commentLikeUsers)}
                commentLikeUsers={c.commentLikeUsers}
                onDeleteComment={() => handleDeleteComment(c.id)}
                dateTimeCreated={c.dateTimeCreated}
                dateTimeEdited={c.dateTimeEdited}
                activityRef={activityRef}
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
              <img src="/images/userPhotos/anonym.jpg" alt="anonym user" />
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
