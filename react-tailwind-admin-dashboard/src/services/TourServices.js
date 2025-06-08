// TourServices.js
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
 * Fetch all tours
 * @returns {Promise<Array>} Array of tours
 */
export const fetchTours = async () => {
  try {
    const response = await api.get("/tours");
    return response.data;
  } catch (error) {
    console.error("Fetching tours failed:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch tours");
  }
};

/**
 * Create a new tour
 * @param {Object} tourData - Tour data to create
 * @returns {Promise<Object>} Created tour data
 */
export const createTour = async (tourData) => {
  try {
    const response = await api.post("/tours/create", tourData);
    return response.data;
  } catch (error) {
    console.error("Creating tour failed:", error);
    throw new Error(error.response?.data?.message || "Failed to create tour");
  }
};

/**
 * Update a tour
 * @param {string} tourId - ID of the tour to update
 * @param {string} tourName - New tour name
 * @param {Array} sceneIds - Array of scene IDs
 * @param {string} planId - Plan ID
 * @param {Array} localisation - Localization data
 * @param {Array} contactInfos - Contact information
 * @returns {Promise<void>}
 */
export const updateTour = async (
  tourId,
  tourName,
  sceneIds,
  planId,
  localisation,
  contactInfos
) => {
  try {
    const response = await api.put(`/tours/update_tour/${tourId}`, {
      tourName,
      sceneIds,
      planId,
      localisation,
      contactInfos,
    });
    return response.data;
  } catch (error) {
    console.error("Updating tour failed:", error);
    throw new Error(error.response?.data?.message || "Failed to update tour");
  }
};

/**
 * Delete a tour
 * @param {string} tourId - ID of the tour to delete
 * @returns {Promise<void>}
 */
export const deleteTour = async (tourId) => {
  try {
    const response = await api.delete(`/tours/delete_tour/${tourId}`);
    return response.data;
  } catch (error) {
    console.error("Deleting tour failed:", error);
    throw new Error(
      error.response?.data?.message || `Failed to delete tour ${tourId}`
    );
  }
};

/**
 * Fetch a specific tour by ID
 * @param {string} tourId - ID of the tour to fetch
 * @returns {Promise<Object>} Tour data
 */
export const fetchTourById = async (tourId) => {
  try {
    const response = await api.get(`/tours/${tourId}`);
    return response.data;
  } catch (error) {
    console.error("Fetching tour failed:", error);
    throw new Error(
      error.response?.data?.message || `Failed to fetch tour ${tourId}`
    );
  }
};

/**
 * Update a tour with scenes (enhanced version)
 * @param {string} tourId - ID of the tour to update
 * @param {string} tourName - New tour name
 * @param {Array} sceneIds - Array of scene IDs (default empty array)
 * @param {string|null} planId - Plan ID (default null)
 * @param {Array} localisation - Localization data (default empty array)
 * @param {Array} contactInfos - Contact information (default empty array)
 * @returns {Promise<Object>} Updated tour data
 */
export const updateTourWithScenes = async (
  tourId,
  tourName,
  sceneIds = [],
  planId = null,
  localisation = [],
  contactInfos = []
) => {
  try {
    const validSceneIds = Array.isArray(sceneIds) ? sceneIds : [];

    const response = await api.put(`/tours/update_tour/${tourId}`, {
      tourName,
      sceneIds: validSceneIds,
      planId,
      localisation,
      contactInfos,
    });
    return response.data;
  } catch (error) {
    console.error("Updating tour with scenes failed:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update tour with scenes"
    );
  }
};


export const fetchMonthlyTours = async () => {
  try {
    const response = await api.get("/tours/monthly-tours");
    return response.data;
  } catch (error) {
    console.error("Fetching monthly tours failed:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch monthly tours");
  }
}