export default function handlePutRate() {
  return (users, visitorUserId) => {
    if (!users) {
      return 0;
    }
    let rate = 0;
    users.forEach((u) => {
      if (u.id === visitorUserId) {
        rate = u.rate;
      }
    });
    return rate;
  };
}
