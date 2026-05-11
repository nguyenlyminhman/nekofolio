import axios from "axios";

import { ADMIN_AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth-constants";

export const endpoint = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  withCredentials: true,
});

endpoint.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }
  const token = localStorage.getItem(ADMIN_AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});