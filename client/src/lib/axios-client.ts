import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status, config } = error.response || {};

    // Handle 401 errors
    if (status === 401) {
      // For /user/current endpoint, we expect 401 when not logged in
      // So we create a custom error without the noisy response object
      if (config?.url === "/user/current") {
        const customError = {
          ...error,
          errorCode: data?.errorCode || "UNAUTHORIZED",
          response: {
            ...error.response,
            status,
            data
          }
        };
        return Promise.reject(customError);
      }
      
      // For other endpoints, redirect to login
      if (data?.message === "Unauthorized. Please log in." || data === "Unauthorized") {
        window.location.href = "/";
      }
    }

    const customError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
