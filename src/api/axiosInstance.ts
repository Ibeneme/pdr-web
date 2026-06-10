import axios from "axios";

export const baseURL = "https://kindred-server.onrender.com";

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Dynamic Token injection pipeline
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    console.log("[AXIOS INTERCEPTOR] Found token:", token ? "YES" : "NO");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catching invalid/expired sessions global handler
axiosInstance.interceptors.response.use(
  (response) => {
    // Pass successful payloads cleanly straight back to caller streams
    return response;
  },
  (error) => {
    // Safely check if response contains data parameters and match against 401 statuses
    if (error.response && error.response.status === 401) {
      console.warn("[AXIOS INTERCEPTOR] Status 401 detected. Session expired. Logging out...");

      // 1. Purge all secure administration authorization tokens from client storage
      localStorage.removeItem("adminToken");

      // Clear out any other app state keys here if you have them (e.g., user info)
      // localStorage.removeItem("adminUser");

      // 2. Clear window locations to break unauthenticated components layouts 
      // and let your route guard components throw the client back to '/login'
      window.location.href = "/admin";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;