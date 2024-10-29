"use-client";

import axios from "axios";
import EnvironmentManager from "./EnvironmentManager";
import { HTTP_STATUS_CODE_UNAUTHORIZED } from "@/constants";

const environmentManager = EnvironmentManager.getInstance();
const axiosInstance = axios.create({
  baseURL: environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_CLIENT_BASE_URL"
  ),
  timeout: 20000,
  withCredentials: true,
});

// If client receives a 401 as responses and he is not in the login page it will be redirected to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === HTTP_STATUS_CODE_UNAUTHORIZED &&
      window.location.pathname !== "/login"
    ) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
