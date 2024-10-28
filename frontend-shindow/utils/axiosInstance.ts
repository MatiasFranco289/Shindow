"use-client";

// TODO: Hacer que te deslogue si recibis un 401 y no estas en la pantalla
import axios from "axios";
import EnvironmentManager from "./EnvironmentManager";

const environmentManager = EnvironmentManager.getInstance();
const axiosInstance = axios.create({
  baseURL: environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_CLIENT_BASE_URL"
  ),
  timeout: 20000,
  withCredentials: true,
});

export default axiosInstance;
