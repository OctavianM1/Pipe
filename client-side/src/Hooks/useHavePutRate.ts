import { ServerActivityUserRaiting } from "../api/serverDataInterfaces";

export default function useHavePutRate() {
  return (users: ServerActivityUserRaiting[], visitorUserId: string) => {
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
