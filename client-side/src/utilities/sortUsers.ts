import { ServerUser } from "../api/serverDataInterfaces";

export default function sortUsers(sortBy: string, users: ServerUser[]) {
  if (sortBy === "activities-asc") {
    return users.sort((a, b) => a.numberOfActivities - b.numberOfActivities);
  } else if (sortBy === "activities-desc") {
    return users.sort((a, b) => b.numberOfActivities - a.numberOfActivities);
  } else if (sortBy === "following-asc") {
    return users.sort((a, b) => a.countFollowing - b.countFollowing);
  } else if (sortBy === "following-desc") {
    return users.sort((a, b) => b.countFollowing - a.countFollowing);
  } else if (sortBy === "followers-asc") {
    return users.sort((a, b) => a.countFollowers - b.countFollowers);
  } else if (sortBy === "followers-desc") {
    return users.sort((a, b) => b.countFollowers - a.countFollowers);
  } else if (sortBy === "name-asc") {
    return users.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-desc") {
    return users.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    return users;
  }
}
