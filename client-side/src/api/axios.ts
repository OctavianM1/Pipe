import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    throw error.message;
  }
  if (error.response.status === 401) {
    window.localStorage.setItem("user", "{}");
  }
  throw error.response;
});

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(window.localStorage.getItem("user") || "{}");
    if (user) config.headers.Authorization = `Bearer ${user.token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

const responseBody = (response: any) => {
  return response ? response.data : null;
};

const request = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Users = {
  list: () => request.get("/user"),
  details: (id: string) => request.get(`/user/${id}`),
  create: (body: { name: string; email: string; password: string }) =>
    request.post("/user/register", body),
  delete: (id: string) => request.delete(`/user/${id}`),
  login: (body: { email: string; password: string }) =>
    request.post("/user/login", body),
  usersActivity: (userHostId: string, userVisitorId: string) =>
    request.get(`/user/${userHostId}/${userVisitorId}`),
  updateName: (body: { userId: string; newName: string }) =>
    request.put("/user/changeName", body),
  updateEmail: (body: { userId: string; newEmail: string }) =>
    request.put("/user/changeEmail", body),
  updatePassword: (body: {
    userId: string;
    newPassword: string;
    oldPassword: string;
  }) => request.put("/user/changePassword", body),
  confirmEmail: (email: string) => request.get(`/user/confirmEmail/${email}`),
  sendRecoveryPassword: (email: string) =>
    request.get(`/user/sendRecoveryPassword/${email}`),
  sendConfirmationEmail: (email: string) =>
    request.get(`/user/sendConfirmationEmail/${email}`),
  recoveryPassword: (body: { email: string; password: string }) =>
    request.put("user/recoveryPassword", body),
  subscribeToSendEmails: (body: { email: string }) =>
    request.post("user/subscribe", body),
  isSubscribed: (email: string) => request.get(`/user/isSubscribed/${email}`),
};

const Activities = {
  create: (body: {
    userHostId: string;
    title: string;
    body: string;
    subject: string;
  }) => request.post("/activity/create", body),
  list: (id: string, matchString?: string) =>
    request.post("/activity", { id, matchString: matchString || "" }),
  detail: (activityId: string) =>
    request.get(`/activity/getActivity/${activityId}`),
  update: (body: {
    activityId: string;
    title: string;
    subject: string;
    body: string;
  }) => request.put("/activity/update", body),
  like: (body: { userId: string; activityId: string }) =>
    request.post("/activity/like", body),
  rate: (body: { userId: string; activityId: string; rate: number }) =>
    request.post("/activity/rate", body),
  deleteRate: (body: { userId: string; activityId: string }) =>
    request.post("/activity/delete-rate", body),
  delete: (id: string) => request.delete(`/activity/${id}`),
  addComment: (body: {
    userId: string;
    activityId: string;
    commentBody: string;
  }) => request.post("/activity/add-comment", body),
  addLikeToComment: (body: {
    userId: string;
    activityId: string;
    commentId: string;
  }) => request.post("activity/like-comment", body),
  deleteComment: (id: string) =>
    request.delete(`activity/delete-comment/${id}`),
  updateComment: (body: { id: string; commentBody: string }) =>
    request.put("/activity/update-comment", body),
  addCommentResponse: (body: {
    parentActivityCommentId: string;
    userId: string;
    comment: string;
  }) => request.put("/activity/add-comment-response", body),
  getCommentResponses: (commentId: string) =>
    request.get(`/activity/comment-responses/${commentId}`),
  addLikeCommentResponse: (body: {
    userId: string;
    commentResponseId: string;
  }) => request.put("/activity/comment-response-add-like", body),
  deleteCommentResponse: (responseCommentId: string) =>
    request.delete(`/activity/delete-response-comment/${responseCommentId}`),
  updateCommentResponse: (body: {
    responseCommentId: string;
    newCommentBody: string;
  }) => request.post("/activity/upldate-comment-response", body),
  likedActivities: (body: {
    userId: string;
    took: number;
    toTake: number;
    sortBy: string;
  }) => request.post("/activity/liked-activities", body),
  ratedActivities: (body: {
    userId: string;
    took: number;
    toTake: number;
    sortBy: string;
  }) => request.post("/activity/rated-activities", body),
  likedComments: (body: {
    userId: string;
    took: number;
    toTake: number;
    sortBy: string;
  }) => request.post("/activity/liked-comments", body),
};

const Follows = {
  following: (id: string) => request.get(`/follows/following/${id}`),
  follows: (id: string) => request.get(`/follows/followers/${id}`),
  follow: (body: { userId: string; followUserId: string }) =>
    request.post("/follows/follow", body),
  unfollow: (body: { userId: string; followUserId: string }) =>
    request.post("/follows/unfollow", body),
};

const Search = {
  userNumber: (number: number) => request.get(`/search/usersNumber/${number}`),
  allUsers: (userId: string, matchString: string | undefined) =>
    request.post("/search/searchAllUsers", {
      userId,
      matchString: matchString || "",
    }),
  followingUsers: (userId: string, matchString: string | undefined) =>
    request.post(`/search/searchFollowingUsers`, {
      userId,
      matchString: matchString || "",
    }),
  followsUsers: (userId: string, matchString: string | undefined) =>
    request.post(`/search/searchFollowsUsers`, {
      userId,
      matchString: matchString || "",
    }),
  setInputAllUsers: (body: { userId: string; input: string | undefined }) =>
    request.post("/search/setInputAllUsers", body),
  setInputFollowingUsers: (body: {
    userId: string;
    input: string | undefined;
  }) => request.post("/search/setInputFollowingUsers", body),
  setInputFollowsUsers: (body: { userId: string; input: string | undefined }) =>
    request.post("/search/setInputFollowsUsers", body),
  deleteAllUsersInput: (userId: string, input: string | undefined) =>
    request.delete(`/search/allUsers/${userId}/${input}`),
  deleteFollowingUsersInput: (userId: string, input: string | undefined) =>
    request.delete(`/search/followingUsers/${userId}/${input}`),
  deleteFollowsUsersInput: (userId: string, input: string | undefined) =>
    request.delete(`/search/followsUsers/${userId}/${input}`),
  getActivities: (
    userHostId: string,
    userVisitorId: string,
    matchString: string
  ) =>
    request.post("/search/activities", {
      userHostId,
      userVisitorId,
      userInput: matchString || "",
    }),
  setInputActivities: (body: {
    userInput: string;
    userHostId: string;
    userVisitorId: string;
  }) => request.post("/search/setInputActivities", body),
  deleteInputActivities: (body: {
    userInput: string;
    userHostId: string;
    userVisitorId: string;
  }) => request.post("/search/deleteInputActivities", body),
};

const UploadFile = {
  userCoverImage: (body: FormData) =>
    request.post("/uploadFile/userCoverImage", body),
};

export { Users, Activities, Follows, Search, UploadFile };
