import { Dispatch, RefObject, useCallback } from "react";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";

export default function useOnEditCommentSubmit(
  commentInput: RefObject<HTMLInputElement>,
  commentEdit: {
    comment: string;
    editMode: boolean;
  },
  update: () => Promise<any>,
  dispatchCommentEdit: Dispatch<{
    type: string;
    comment?: string | undefined;
  }>
) {
  const error = useApiErrorHandler();
  return useCallback(
    (ev) => {
      let commentValue = "";
      if (commentInput.current) {
        commentValue = commentInput.current.value;
      } else {
        commentValue = ev.target.value;
      }
      if (commentValue.trim() !== "" && commentValue !== commentEdit.comment) {
        update()
          .then(() => {
            dispatchCommentEdit({ type: "set", comment: commentValue });
          })
          .catch(error);
      }
      ev.preventDefault();
    },
    [error, commentEdit.comment, dispatchCommentEdit, commentInput, update]
  );
}
