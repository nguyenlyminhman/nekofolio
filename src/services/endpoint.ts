import axios from "axios";

export const endpoint = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  withCredentials: true,
});