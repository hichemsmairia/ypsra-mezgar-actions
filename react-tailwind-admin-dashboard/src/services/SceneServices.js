// SceneServices.js
import axios from "axios";
import { store } from "../../redux/store/store";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized - Please login again");
          break;
        case 403:
          console.error("Forbidden - You don't have permission");
          break;
        case 404:
          console.error("Not Found - Resource not available");
          break;
        case 500:
          console.error("Server Error - Please try again later");
          break;
        default:
          console.error("Request Error", error.message);
      }
    } else if (error.request) {
      console.error("Network Error - No response received");
    } else {
      console.error("Request Setup Error", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Upload a new scene with file and name
 * @param {File} file - The scene file to upload
 * @param {string} name - Name of the scene
 * @returns {Promise<Object>} The created scene data
 */
export const uploadScene = async (file, name) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  try {
    const response = await api.post("/scenes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Scene upload failed:", error);
    throw new Error(error.response?.data?.message || "Failed to upload scene");
  }
};

/**
 * Save multiple scenes
 * @param {Array} scenes - Array of scenes to save
 * @returns {Promise<Object>} Saved scenes data
 */
export const saveScenes = async (scenes) => {
  try {
    const response = await api.post("/scenes/save", scenes);
    return response.data;
  } catch (error) {
    console.error("Saving scenes failed:", error);
    throw new Error(error.response?.data?.message || "Failed to save scenes");
  }
};

/**
 * Update multiple scenes
 * @param {Array} scenes - Array of scenes to update
 * @returns {Promise<Object>} Updated scenes data
 */
export const updateScenes = async (scenes) => {
  try {
    const response = await api.put("/scenes/update", scenes);
    return response.data;
  } catch (error) {
    console.error("Updating scenes failed:", error);
    throw new Error(error.response?.data?.message || "Failed to update scenes");
  }
};

/**
 * Delete a scene by ID
 * @param {string} sceneId - ID of the scene to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteScene = async (sceneId) => {
  try {
    const response = await api.delete(`/scenes/delete/${sceneId}`);
    return response.data;
  } catch (error) {
    console.error("Deleting scene failed:", error);
    throw new Error(
      error.response?.data?.message || `Failed to delete scene ${sceneId}`
    );
  }
};

/**
 * Get all scenes
 * @returns {Promise<Array>} Array of scenes
 */
export const getAllScenes = async () => {
  try {
    const response = await api.get("/scenes");
    return response.data;
  } catch (error) {
    console.error("Fetching scenes failed:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch scenes");
  }
};

/**
 * Get single scene by ID
 * @param {string} sceneId - ID of the scene to fetch
 * @returns {Promise<Object>} Scene data
 */
export const getSceneById = async (sceneId) => {
  try {
    const response = await api.get(`/scenes/${sceneId}`);
    return response.data;
  } catch (error) {
    console.error("Fetching scene failed:", error);
    throw new Error(
      error.response?.data?.message || `Failed to fetch scene ${sceneId}`
    );
  }
};
