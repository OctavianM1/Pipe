import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    console.log("Network Error");
    throw error.message;
  }
  if (error.response.status === 401) {
    window.localStorage.setItem("user", "{}");
  }
  throw error.response;
});

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) config.headers.Authorization = `Bearer ${user.token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

const responseBody = (response) => {
  return response ? response.data : null;
};

const request = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  delete: (url) => axios.delete(url).then(responseBody),
};

const Users = {
  list: () => request.get("/user"),
  details: (id) => request.get(`/user/${id}`),
  create: (body) => request.post("/user/register", body),
  delete: (id) => request.delete(`/user/${id}`),
  login: (body) => request.post("/user/login", body),
  usersActivity: (userHostId, userVisitorId) =>
    request.get(`/user/${userHostId}/${userVisitorId}`),
  updateName: (body) => request.put("/user/changeName", body),
  updateEmail: (body) => request.put("/user/changeEmail", body),
  updatePassword: (body) => request.put("/user/changePassword", body),
  confirmEmail: (email) => request.get(`/user/confirmEmail/${email}`),
  sendRecoveryPassword: (email) =>
    request.get(`/user/sendRecoveryPassword/${email}`),
  sendConfirmationEmail: (email) =>
    request.get(`/user/sendConfirmationEmail/${email}`),
  recoveryPassword: (body) => request.put('user/recoveryPassword', body)
};

const Activities = {
  create: (body) => request.post("/activity/create", body),
  list: (id, matchString) =>
    request.post("/activity", { id, matchString: matchString || "" }),
  detail: ( activityId) =>
    request.get(`/activity/getActivity/${activityId}`),
  update: (body) => request.put("/activity/update", body),
  like: (body) => request.post("/activity/like", body),
  rate: (body) => request.post("/activity/rate", body),
  deleteRate: (body) => request.post("/activity/delete-rate", body),
  delete: (id) => request.delete(`/activity/${id}`),
  addComment: (body) => request.post("/activity/add-comment", body),
  addLikeToComment: (body) => request.post("activity/like-comment", body),
  deleteComment: (id) => request.delete(`activity/delete-comment/${id}`),
  updateComment: (body) => request.put("/activity/update-comment", body),
};

const Follows = {
  following: (id) => request.get(`/follows/following/${id}`),
  follows: (id) => request.get(`/follows/followers/${id}`),
  follow: (body) => request.post("/follows/follow", body),
  unfollow: (body) => request.post("/follows/unfollow", body),
};

const Search = {
  userNumber: (number) => request.get(`/search/usersNumber/${number}`),
  allUsers: (userId, matchString) =>
    request.post("/search/searchAllUsers", {
      userId,
      matchString: matchString || "",
    }),
  followingUsers: (userId, matchString) =>
    request.post(`/search/searchFollowingUsers`, {
      userId,
      matchString: matchString || "",
    }),
  followsUsers: (userId, matchString) =>
    request.post(`/search/searchFollowsUsers`, {
      userId,
      matchString: matchString || "",
    }),
  setInputAllUsers: (body) => request.post("/search/setInputAllUsers", body),
  setInputFollowingUsers: (body) =>
    request.post("/search/setInputFollowingUsers", body),
  setInputFollowsUsers: (body) =>
    request.post("/search/setInputFollowsUsers", body),
  deleteAllUsersInput: (userId, input) =>
    request.delete(`/search/allUsers/${userId}/${input}`),
  deleteFollowingUsersInput: (userId, input) =>
    request.delete(`/search/followingUsers/${userId}/${input}`),
  deleteFollowsUsersInput: (userId, input) =>
    request.delete(`/search/followsUsers/${userId}/${input}`),
  getActivities: (userHostId, userVisitorId, matchString) =>
    request.post("/search/activities", {
      userHostId,
      userVisitorId,
      userInput: matchString || "",
    }),
  setInputActivities: (body) =>
    request.post("/search/setInputActivities", body),
  deleteInputActivities: (body) =>
    request.post("/search/deleteInputActivities", body),
};

export { Users, Activities, Follows, Search };
