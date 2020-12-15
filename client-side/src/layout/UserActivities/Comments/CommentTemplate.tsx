import React, { RefObject, useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ServerUser } from "../../../api/serverDataInterfaces";
import { ActivityRefContext } from "./../Activity/Activity";
import UserCommentLike from "./UserCommentLike";

const CommentTemplate = ({
  user,
  onEditCommentSubmit,
  commentInput,
  commentLikeRef,
  usersLiked,
  commentLikesDisplayedUsers,
  isLikedComment,
  commentEdit,
}: {
  user: ServerUser;
  onEditCommentSubmit: (ev: any) => void;
  commentInput: RefObject<HTMLInputElement>;
  commentLikeRef: RefObject<HTMLDivElement>;
  usersLiked: ServerUser[];
  commentLikesDisplayedUsers: ServerUser[];
  isLikedComment: boolean;
  commentEdit: {
    comment: string;
    editMode: boolean;
  };
}) => {
  const activityRef = useContext(ActivityRefContext);

  const [hoveringCommentLikes, setHoveringCommentLikes] = useState({
    hover: false,
    part: 1, // 1 to right, 2 to left
  });

  const handleHoverCommentLike = useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      ev.stopPropagation();
      const activityRight = activityRef?.current?.getBoundingClientRect()
        .right!;
      const likeContainerRight = commentLikeRef?.current?.getBoundingClientRect()
        .right!;
      if (likeContainerRight + 300 < activityRight) {
        setHoveringCommentLikes({ hover: true, part: 1 });
      } else {
        setHoveringCommentLikes({ hover: true, part: 2 });
      }
    },
    [activityRef, commentLikeRef]
  );

  const handleUnHoverCommentLike = useCallback(() => {
    setHoveringCommentLikes((oldHover) => {
      return {
        hover: false,
        part: oldHover.part,
      };
    });
  }, []);

  return (
    <>
      <div className="my-activities__activities-side__activity__comments__comment__name">
        <Link to={`/activities/${user.id}`}>{user.name}</Link>
      </div>
      {commentEdit.editMode ? (
        <form className="comment__edit__form" onSubmit={onEditCommentSubmit}>
          <input
            ref={commentInput}
            className="comment__edit__input"
            name="edit-response-input"
            defaultValue={commentEdit.comment}
            autoFocus
          />
          <span className="comment__edit__input__border">&nbsp;</span>
        </form>
      ) : (
        <div className="my-activities__activities-side__activity__comments__comment__body">
          {commentEdit.comment}
        </div>
      )}
      <div
        className="comment-likes"
        ref={commentLikeRef}
        onMouseEnter={handleHoverCommentLike}
        onMouseLeave={handleUnHoverCommentLike}
      >
        <div
          className={
            hoveringCommentLikes.hover && usersLiked && usersLiked.length !== 0
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
            {usersLiked.length}
          </span>
        </div>
      </div>
    </>
  );
};

export default CommentTemplate;
