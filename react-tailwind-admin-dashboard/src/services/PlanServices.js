import axios from "axios";
import { store } from "../../redux/store/store";

const API_URL_ENV = import.meta.env.VITE_API_URL;

const API_URL = `${API_URL_ENV}`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const uploadPlan = async (file, planHotspots) => {
  const formData = new FormData();

  if (file instanceof File) {
    formData.append("file", file);
  } else if (typeof file === "string") {
    const response = await fetch(file);
    const blob = await response.blob();
    const fileName = file.split("/").pop();
    const fileObj = new File([blob], fileName, { type: blob.type });
    formData.append("file", fileObj);
  }

  const hotspotsArray = Array.isArray(planHotspots) ? planHotspots : [];
  formData.append("planHotspots", JSON.stringify(hotspotsArray));

  try {
    const response = await api.post("/api/plans/upload_plan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading plan:", error);
    throw error;
  }
};

export const savePlans = async (scenes) => {
  try {
    const response = await api.post("/api/plans/save", scenes);
    return response.data;
  } catch (error) {
    console.error("Error saving scenes:", error);
    throw error;
  }
};

export const deletePlanById = async (planId) => {
  try {
    const response = await api.delete(`/api/plans/delete/${planId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }
};
