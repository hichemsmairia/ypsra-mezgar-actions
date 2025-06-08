import axios from "axios";
import { store } from "../../redux/store/store";





const state = store.getState();
const token = state.auth?.token;
console.log("Token in visitServices:", token);


const api = axios.create({
  baseURL: "http://localhost:8080/api",
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
}

export const getVisitorsPositions = async () => {
  let result = await api.get("/visitors/positions");
  return result.data;
}