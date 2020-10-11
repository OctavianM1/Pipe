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
  login: (body) => request.post("user/login", body),
};

const Activities = {
  create: (body) => request.post("/activity/create", body),
  list: (id) => request.get(`/activity/${id}`)
};

export { Users, Activities };
