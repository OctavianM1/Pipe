import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useRef,
} from "react";
import { Activities } from "../../../api/axios";
import { ServerActivityCommentResponse } from "../../../api/serverDataInterfaces";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";
import useDisplayLimited from "../../../Hooks/useDisplayLimited";
import BottomCommentButtons from "./BottomCommentButtons";
import CommentTemplate from "./CommentTemplate";
import EditModeIcons from "./EditModeIcons";
import useCommentEdit from "./useCommentEdit";
import useLikes from "./useLikes";
import useOnEditCommentSubmit from "./useOnEditCommentSubmit";
import useSubmitCommentOutside from "./useSubmitCommentOutside";

const ResponseComment = ({
  coverPhotoSrc,
  profileImgError,
  onClickRespond,
  setCommentResponses,
  setNumberOfResponses,
  responseComment,
}: {
  coverPhotoSrc: string;
  profileImgError: (ev: SyntheticEvent<HTMLImageElement, Event>) => void;
  onClickRespond: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setCommentResponses: Dispatch<
    SetStateAction<ServerActivityCommentResponse[]>
  >;
  setNumberOfResponses: Dispatch<SetStateAction<number>>;
  responseComment: ServerActivityCommentResponse;
}) => {
  const [likes, dispatchLikes] = useLikes(
    getIsLikedComment(),
    responseComment.commentResponseLikes
  );

  const { commentEdit, dispatchCommentEdit } = useCommentEdit(
    responseComment.comment
  );

  const commentInput = useRef<HTMLInputElement>(null);
  const commentLikeRef = useRef<HTMLDivElement>(null);
  const cancelEdit = useRef<HTMLImageElement>(null);

  const commentLikesDisplayedUsers = useDisplayLimited(10, likes.allUsersLike);

  const error = useApiErrorHandler();

  function getIsLikedComment() {
    for (
      let i = 0;
      responseComment.commentResponseLikes &&
      i < responseComment.commentResponseLikes.length;
      i++
    ) {
      if (
        responseComment.commentResponseLikes[i].id === responseComment.user.id
      ) {
        return true;
      }
    }
    return false;
  }

  const onDeleteComment = () => {
    Activities.deleteCommentResponse(responseComment.id)
      .then(() => {
        setCommentResponses((oldResponses) =>
          [...oldResponses].filter((r) => r.id !== responseComment.id)
        );
        setNumberOfResponses((n) => n - 1);
      })
      .catch(error);
  };

  const handleOnLikeComment = () => {
    Activities.addLikeCommentResponse({
      userId: responseComment.user.id,
      commentResponseId: responseComment.id,
    })
      .then((newUserLike) => {
        dispatchLikes({ type: "default", visitorUser: newUserLike });
      })
      .catch(error);
  };

  const updateComment = useCallback(() => {
    return Activities.updateCommentResponse({
      responseCommentId: responseComment.id,
      newCommentBody: commentInput.current!.value,
    });
  }, [responseComment.id]);

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
    responseComment.id,
    updateComment
  );

  return (
    <>
      <div className="comment__container" style={{ marginLeft: "6%" }}>
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
            className={
              commentEdit.editMode ? "comment__container__full-width" : ""
            }
          >
            <CommentTemplate
              user={responseComment.user}
              commentEdit={commentEdit}
              onEditCommentSubmit={onEditCommentSubmit}
              commentInput={commentInput}
              commentLikeRef={commentLikeRef}
              usersLiked={likes.allUsersLike}
              commentLikesDisplayedUsers={commentLikesDisplayedUsers}
              isLikedComment={likes.isLikedComment}
            />
          </div>
        </div>
        <EditModeIcons
          editMode={commentEdit.editMode}
          cancelEdit={cancelEdit}
          user={responseComment.user}
          onDeleteComment={onDeleteComment}
          toggleEditMode={() => dispatchCommentEdit({ type: "toggle" })}
        />
      </div>
      <BottomCommentButtons
        style={{ marginLeft: "13%" }}
        onClickRespond={onClickRespond}
        isLikedComment={likes.isLikedComment}
        handleOnLikeComment={handleOnLikeComment}
      />
    </>
  );
};

export default ResponseComment;
