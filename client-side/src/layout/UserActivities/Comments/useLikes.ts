import { Dispatch, useReducer } from "react";
import { ServerUser } from "../../../api/serverDataInterfaces";

export default function useLikes(
  initIsLiked: boolean,
  initUsers: ServerUser[]
): [
  {
    isLikedComment: boolean;
    allUsersLike: ServerUser[];
  },
  Dispatch<{
    type: string;
    visitorUser: ServerUser;
  }>
] {
  const [likes, dispatchLikes] = useReducer(likesReducer, {
    isLikedComment: initIsLiked,
    allUsersLike: initUsers,
  });

  return [likes, dispatchLikes];
}

function likesReducer(
  state: {
    isLikedComment: boolean;
    allUsersLike: ServerUser[];
  },
  action: { type: string; visitorUser: ServerUser }
) {
  switch (action.type) {
    case "default":
      if (state.isLikedComment) {
        return {
          isLikedComment: false,
          allUsersLike: state.allUsersLike.filter(
            (c) => c.id !== action.visitorUser.id
          ),
        };
      }
      return {
        isLikedComment: true,
        allUsersLike: state.allUsersLike.concat(action.visitorUser),
      };
    default:
      throw new Error("Invalid action");
  }
}
