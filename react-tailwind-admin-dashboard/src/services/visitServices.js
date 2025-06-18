import axios from "axios";
import { store } from "../../redux/store/store";

const state = store.getState();
const token = state.auth?.token;
console.log("Token in visitServices:", token);

const API_URL_ENV = import.meta.env.VITE_API_URL;

const API_URL = `${API_URL_ENV}`;
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000, // 10 seconds timeout
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getMonthlyVisitorsService = async () => {
  let result = await api.get("/visitors/monthly");
  return result.data;
};

export const trackVisitorService = async (visitorData) => {
  let result = await api.post("/visitors/track", visitorData);
  return result.data;
};

export const getVisitorsPositions = async () => {
  let result = await api.get("/visitors/positions");
  return result.data;
};
