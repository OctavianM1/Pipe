import React, {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import "../userActivities.scss";
import "../../../components/CSSTransitions/cssTransitions.scss";
import { Activities } from "../../../api/axios";
import Comment from "./../Comments/Comment";
import { Link } from "react-router-dom";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import {
  ServerActivityComment,
  ServerActivityRaiting,
} from "../../../api/serverDataInterfaces";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useHavePutLike from "../../../Hooks/useHavePutLike";
import { VisitorUserContext } from "../UserActivities";
import CommentInput from "../Comments/CommentInput";
import ActivityRaiting from "./ActivityRaiting";

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
  onRemove: () => void;
  comments: ServerActivityComment[];
}

export const ActivityRefContext = createContext<RefObject<HTMLDivElement>>(
  null!
);

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
  onRemove,
  comments,
}: ActivityProps) => {
  const visitorUser = useContext(VisitorUserContext);

  const [activityLikes, dispatchActivityLikes] = useReducer(
    activityLikesReducer,
    {
      likedActivity: isLiked,
      numberOfLikes: likesNumber,
    }
  );
  const [activityComments, setActivityComments] = useState(comments);
  const [displayedCommentNumber, setDisplayedCommentsNumber] = useState(2);

  const commentInput = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

  const error = useApiErrorHandler();

  const handleLikeButton = () => {
    Activities.like({ userId: visitorUser.id, activityId: id })
      .then(() => {
        dispatchActivityLikes({ type: "default" });
      })
      .catch(error);
  };

  const handleIsLikedComment = useHavePutLike();

  const displayedComments = useMemo(() => {
    const arr: ServerActivityComment[] = [];
    for (let i = 0; i < displayedCommentNumber && activityComments[i]; i++) {
      arr.push(activityComments[i]);
    }
    return arr;
  }, [displayedCommentNumber, activityComments]);

  const handleDeleteComment = useCallback(
    (id: string) => {
      Activities.deleteComment(id)
        .then(() => {
          setActivityComments((oldActivityComments) =>
            [...oldActivityComments].filter((c) => c.id !== id)
          );
        })
        .catch(error);
    },
    [error]
  );

  const onKey = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        const comment = commentInput.current?.innerText || "";
        if (comment.trim() !== "") {
          Activities.addComment({
            userId: visitorUser.id,
            activityId: id,
            commentBody: comment,
          })
            .then((comment: ServerActivityComment) => {
              setActivityComments(
                (activityComments: ServerActivityComment[]) => {
                  return [comment, ...activityComments];
                }
              );
              if (commentInput.current) {
                commentInput.current.innerText = "";
              }
            })
            .catch(error);
        }
      }
    },
    [id, visitorUser.id, error]
  );

  return (
    <>
      <div className="my-activities__container">
        {hostUserId ===
          JSON.parse(localStorage.getItem("user") || "{}")["id"] && (
          <div className="my-activities__activities-side__activity__editing">
            <Link to={`/activities/${hostUserId}/edit/${id}`}>
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
          <ActivityRaiting
            totalRaiting={totalRaiting}
            activityId={id}
            personalRate={personalRate}
          />
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
            <button onClick={handleLikeButton}>
              {activityLikes.likedActivity ? (
                <img src="/images/activities/blueLike.svg" alt="blue like" />
              ) : (
                <img src="/images/activities/like.svg" alt="like" />
              )}
              {activityLikes.likedActivity ? (
                <div className="my-activities__activities-side__activity__buttons__like">
                  UnLike ({activityLikes.numberOfLikes})
                </div>
              ) : (
                <div>Like ({activityLikes.numberOfLikes})</div>
              )}
              <span>&nbsp;</span>
            </button>
            <button onClick={() => commentInput?.current?.focus()}>
              <img src="/images/activities/comment.svg" alt="comment" />
              Comment<span>&nbsp;</span>
            </button>
          </div>
          <div className="my-activities__activities-side__activity__comments">
            <TransitionGroup>
              {displayedComments.map((c) => (
                <CSSTransition
                  timeout={300}
                  classNames="fade"
                  key={c.id}
                  in={displayedComments.length > 0}
                  unmountOnExit
                >
                  <ActivityRefContext.Provider value={activityRef}>
                    <Comment
                      key={c.id}
                      commentData={c}
                      activityId={id}
                      isLiked={handleIsLikedComment(
                        c.commentLikeUsers,
                        visitorUser.id
                      )}
                      onDeleteComment={handleDeleteComment}
                    />
                  </ActivityRefContext.Provider>
                </CSSTransition>
              ))}
            </TransitionGroup>
            {displayedCommentNumber < activityComments.length ? (
              <button
                className="my-activities__activities-side__activity__comments__show-more"
                onClick={() =>
                  setDisplayedCommentsNumber(displayedCommentNumber * 2)
                }
              >
                Show more comments (
                {activityComments.length - displayedCommentNumber})
              </button>
            ) : (
              <button
                className="my-activities__activities-side__activity__comments__show-more"
                onClick={() => setDisplayedCommentsNumber(2)}
              >
                {activityComments.length > 2 ? "Show less" : ""}
              </button>
            )}
            <CommentInput inputRef={commentInput} onKey={onKey} />
          </div>
        </div>
      </div>
    </>
  );
};

function activityLikesReducer(
  state: { likedActivity: boolean; numberOfLikes: number },
  action: { type: string }
) {
  switch (action.type) {
    case "default":
      if (state.likedActivity) {
        return { likedActivity: false, numberOfLikes: state.numberOfLikes - 1 };
      }
      return { likedActivity: true, numberOfLikes: state.numberOfLikes + 1 };
    default:
      throw new Error("Invalid action");
  }
}

export default Activity;