import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Use .env for base URL
  withCredentials: true, // Include credentials
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Fetch the latest token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"]; // Remove token if not available
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
