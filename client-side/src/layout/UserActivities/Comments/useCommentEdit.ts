import { useReducer } from "react";

export default function useCommentEdit(initCommentBody: string) {
  const [commentEdit, dispatchCommentEdit] = useReducer(commentEditReducer, {
    comment: initCommentBody,
    editMode: false,
  });
  return { commentEdit, dispatchCommentEdit };
}

function commentEditReducer(
  state: { comment: string; editMode: boolean },
  action: { type: string; comment?: string }
) {
  switch (action.type) {
    case "set":
      return {
        comment: action.comment || "",
        editMode: false,
      };
    case "close":
      return {
        ...state,
        editMode: false,
      };
    case "toggle":
      return { ...state, editMode: !state.editMode };
    default:
      throw new Error("Invalid action");
  }
}
