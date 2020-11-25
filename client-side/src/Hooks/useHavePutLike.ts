import { useCallback } from "react";
import { ServerUser } from "../api/serverDataInterfaces";

export default function useHavePutLike() {
  return useCallback((users: ServerUser[], visitorUserId: string) => {
    if (!users) {
      return false;
    }
    let putLike = false;
    users.forEach((u) => {
      if (u.id === visitorUserId) {
        putLike = true;
      }
    });
    return putLike;
  }, []);
}
