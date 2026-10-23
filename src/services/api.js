import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});