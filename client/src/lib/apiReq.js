import axios from "axios";

const apiReq = axios.create({
  baseURL: "https://localhost:7135/api",
  withCredentials: true,
});

// Request interceptor to add auth token to every request
apiReq.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiReq.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (token expired or invalid)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiReq;
