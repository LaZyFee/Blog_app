// axiosConfig.js

import axios from "axios";

// Axios Global Configuration
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
