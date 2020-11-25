import { Dispatch, RefObject, useEffect } from "react";
import useApiErrorHandler from "../../../Hooks/useApiErrorHandler";

export default function useSubmitCommentOutside(
  commentEdit: {
    comment: string;
    editMode: boolean;
  },
  commentInput: RefObject<HTMLInputElement>,
  cancelEdit: RefObject<HTMLImageElement>,
  dispatchCommentEdit: Dispatch<{
    type: string;
    comment?: string | undefined;
  }>,
  commentId: string,
  update: () => Promise<any>
) {
  const error = useApiErrorHandler();
  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      if (commentEdit.editMode) {
        if (commentInput.current && commentInput.current === ev.target) {
          return;
        }
        if (
          (cancelEdit.current && ev.target === cancelEdit.current) ||
          commentInput?.current?.value === commentEdit.comment
        ) {
          dispatchCommentEdit({ type: "close" });
        } else if (commentInput.current && ev.target !== commentInput.current) {
          update()
            .then(() => {
              if (commentInput.current) {
                dispatchCommentEdit({
                  type: "set",
                  comment: commentInput.current.value,
                });
              }
            })
            .catch(error);
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [
    commentEdit.editMode,
    commentEdit.comment,
    commentId,
    dispatchCommentEdit,
    cancelEdit,
    commentInput,
    error,
    update,
  ]);
}
