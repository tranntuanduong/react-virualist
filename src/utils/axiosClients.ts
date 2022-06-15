import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";
import { baseURL } from "utils/config";
import localStorage from "./localStorage";

const headers: AxiosRequestConfig["headers"] = {
  "Content-Type": "application/json",
};

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  headers,
});

axiosClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const accessToken = localStorage.get("accessToken");
    if (config.headers) {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export { axiosClient };
