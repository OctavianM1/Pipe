export default function havePutLike() {
  return (users, visitorUserId) => {
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
