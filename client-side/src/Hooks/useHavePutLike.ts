import { ServerUser } from "../api/serverDataInterfaces";

export default function havePutLike() {
  return (users: ServerUser[], visitorUserId: string) => {
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
  };
}
