import { CustomError } from "@/types/custom-error.type";
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
    const { data, status } = error.response;

    // Handle 401 errors - only redirect if not on auth pages and it's an actual auth error
    if (status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === "/" || currentPath === "/sign-up" || currentPath === "/sign-in";
      
      // Only redirect for actual auth errors, not for expected 401s on auth pages
      if (!isAuthPage && data?.errorCode === "ACCESS_UNAUTHORIZED") {
        window.location.href = "/";
      }
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
