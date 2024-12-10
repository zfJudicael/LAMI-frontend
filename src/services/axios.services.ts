import { AuthService } from "@/modules/auth/auth.services";
import axios from "axios";

export const lamiAuth = axios.create({
    baseURL: `${import.meta.env.VITE_LAMI_AUTH_URL}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

export const lamiAPI = axios.create({
    baseURL: `${import.meta.env.VITE_LAMI_API_URL}`,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
  
lamiAPI.interceptors.request.use(
    async (config) => {
      if (AuthService.getToken()) {
        config.headers.Authorization = `Bearer ${AuthService.getToken()}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
);