import axios from "axios";

import { ADMIN_AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth-constants";

export const endpoint = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
});

// REQUEST
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

// RESPONSE
endpoint.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;

    // Token expired / invalid  
    if ( status === 401 && typeof window !== "undefined" ) {
      localStorage.removeItem(ADMIN_AUTH_TOKEN_STORAGE_KEY);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
