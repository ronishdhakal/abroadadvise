import axios from "axios";
import { getAuthToken, refreshAccessToken } from "./auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

axiosInstance.interceptors.request.use(async (config) => {
  let token = getAuthToken();

  if (!token) {
    token = await refreshAccessToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
