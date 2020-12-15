import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import "./../userActivities.scss";
import "../../../components/CSSTransitions/cssTransitions.scss";
import { Activities } from "../../../api/axios";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import {
  ServerActivityComment,
  ServerActivityCommentResponse,
} from "../../../api/serverDataInterfaces";
import useProfileCoverPhotoError from "../../../Hooks/useProfileCoverPhotoError";
import ResponseComment from "./ResponseComment";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import BottomCommentButtons from "./BottomCommentButtons";
import { VisitorUserContext } from "./../UserActivities";
import CommentTemplate from "./CommentTemplate";
import useDisplayLimited from "../../../Hooks/useDisplayLimited";
import EditModeIcons from "./EditModeIcons";
import useCommentEdit from "./useCommentEdit";
import useSubmitCommentOutside from "./useSubmitCommentOutside";
import useOnEditCommentSubmit from "./useOnEditCommentSubmit";
import useCoverImage from "../../../Hooks/useCoverImage";
import useLikes from "./useLikes";
import CommentInput from "./CommentInput";

interface CommentProps {
  activityId: string;
  isLiked: boolean;
  onDeleteComment: (id: string) => void;
  commentData: ServerActivityComment;
}

const Comment = ({
  activityId,
  isLiked,
  onDeleteComment,
  commentData,
}: CommentProps) => {
  const visitorUser = useContext(VisitorUserContext);
  const [likes, dispatchLikes] = useLikes(
    isLiked,
    commentData.commentLikeUsers
  );
  const [displayCommentDate, setDisplayCommentDate] = useState(false);
  const [respondCommentInputMode, setRespondCommentInputMode] = useState(false);

  const { commentEdit, dispatchCommentEdit } = useCommentEdit(
    commentData.comment
  );

  const [commentResponses, setCommentResponses] = useState<
    ServerActivityCommentResponse[]
  >([]);
  const [numberOfResponses, setNumberOfResponses] = useState(
    commentData.numberOfResponses || 0
  );

  const [coverPhotoSrc, setCoverPhotoSrc] = useCoverImage(
    commentData.user.id,
    commentData.user.coverImageExtension
  );
  const [coverPhotoVisitorSrc, setCoverPhotoVisitorSrc] = useCoverImage(
    visitorUser.id,
    visitorUser.coverImageExtension
  );

  const [displayedResponsesNr, setDisplayedResponsesNr] = useState(3);

  const displayedCommentResponses = useMemo(() => {
    const displayedCR = [];
    for (let i = 0; i < displayedResponsesNr && commentResponses[i]; i++) {
      displayedCR.push(commentResponses[i]);
    }
    return displayedCR;
  }, [commentResponses, displayedResponsesNr]);

  const displayedUsersLike = useDisplayLimited(10, likes.allUsersLike);

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
        dispatchLikes({ type: "default", visitorUser });
      })
      .catch(error);
  };

  const updateComment = useCallback(() => {
    return Activities.updateComment({
      id: commentData.id,
      commentBody: commentInput.current!.value,
    });
  }, [commentData.id]);

  const onEditCommentSubmit = useOnEditCommentSubmit(
    commentInput,
    commentEdit,
    updateComment,
    dispatchCommentEdit
  );

  useSubmitCommentOutside(
    commentEdit,
    commentInput,
    cancelEdit,
    dispatchCommentEdit,
    commentData.id,
    updateComment
  );

  const profileImgError = useProfileCoverPhotoError(setCoverPhotoSrc);
  const profileVisitorImgError = useProfileCoverPhotoError(
    setCoverPhotoVisitorSrc
  );

  const onClickRespond = () => {
    setRespondCommentInputMode(true);
    setTimeout(() => {
      responseCommentInputRef.current?.focus();
    }, 40);
  };

  const showCommentResponses = () => {
    Activities.getCommentResponses(commentData.id)
      .then(setCommentResponses)
      .catch(error);
    setDisplayedResponsesNr(3);
  };

  const onKey = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        const comment = responseCommentInputRef.current?.innerText || "";
        if (comment.trim() !== "") {
          Activities.addCommentResponse({
            parentActivityCommentId: commentData.id,
            userId: visitorUser.id,
            comment: comment,
          })
            .then((responses: ServerActivityCommentResponse[]) => {
              setRespondCommentInputMode(false);
              setCommentResponses(responses);
              setNumberOfResponses((nr) => nr + 1);
            })
            .catch(error);
        }
      }
    },
    [visitorUser.id, error, commentData.id]
  );

  const displayDate = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = ev.target as Element;
    if (el && !el.classList.contains("comment-likes__container")) {
      setDisplayCommentDate(true);
    }
  };

  const hideDate = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDisplayCommentDate(false);
  };

  let displayUsersReplied =
    (numberOfResponses > 0 && commentResponses.length === 0) ||
    displayedResponsesNr === 0;

  return (
    <>
      <div className="comment__container">
        <div
          className={
            commentEdit.editMode
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
            onMouseEnter={displayDate}
            onMouseLeave={hideDate}
            className={
              commentEdit.editMode ? "comment__container__full-width" : ""
            }
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
            <CommentTemplate
              user={commentData.user}
              commentEdit={commentEdit}
              onEditCommentSubmit={onEditCommentSubmit}
              commentInput={commentInput}
              commentLikeRef={commentLikeRef}
              usersLiked={likes.allUsersLike}
              commentLikesDisplayedUsers={displayedUsersLike}
              isLikedComment={likes.isLikedComment}
            />
          </div>
        </div>
        <EditModeIcons
          editMode={commentEdit.editMode}
          cancelEdit={cancelEdit}
          user={commentData.user}
          onDeleteComment={() => onDeleteComment(commentData.id)}
          toggleEditMode={() => dispatchCommentEdit({ type: "toggle" })}
        />
      </div>
      <BottomCommentButtons
        isLikedComment={likes.isLikedComment}
        handleOnLikeComment={handleOnLikeComment}
        onClickRespond={onClickRespond}
      />
      {displayUsersReplied && (
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
      <TransitionGroup>
        {displayedCommentResponses.map((c) => (
          <CSSTransition
            timeout={300}
            classNames="fade"
            key={c.id}
            in={commentResponses.length > 0}
            unmountOnExit
          >
            <ResponseComment
              key={c.id}
              responseComment={c}
              coverPhotoSrc={coverPhotoVisitorSrc}
              profileImgError={profileVisitorImgError}
              onClickRespond={onClickRespond}
              setCommentResponses={setCommentResponses}
              setNumberOfResponses={setNumberOfResponses}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      {displayedCommentResponses.length > 0 &&
        displayedCommentResponses.length < commentResponses.length && (
          <button
            className="my-activities__activities-side__activity__comments__show-more"
            onClick={() => setDisplayedResponsesNr(displayedResponsesNr * 2)}
          >
            Show more responses (
            {commentResponses.length - displayedResponsesNr})
          </button>
        )}

      {displayedCommentResponses.length > 0 &&
        displayedCommentResponses.length === commentResponses.length && (
          <button
            className="my-activities__activities-side__activity__comments__show-more"
            onClick={() => setDisplayedResponsesNr(0)}
          >
            Hide responses
          </button>
        )}

      {respondCommentInputMode && (
        <CommentInput inputRef={responseCommentInputRef} onKey={onKey}>
          <img
            id="button-remove-respond-comment"
            src="/images/activities/cancel.svg"
            alt="delete"
            onClick={() => setRespondCommentInputMode(false)}
          />
        </CommentInput>
      )}
    </>
  );
};

export default React.memo(Comment);
