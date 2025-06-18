// src/services/UserServices.js
import axios from "axios";
import { store } from "../../redux/store/store";

const API_URL_ENV = import.meta.env.VITE_API_URL;

const API_URL = `${API_URL_ENV}`;
const api = axios.create({
  baseURL: `${API_URL}/api`,
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
        case 409:
          console.error("Conflict - User already exists");
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
 * Fetch all users
 * @returns {Promise<Array>} Array of users with stringified IDs
 */
export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data.map((user) => ({
      ...user,
      id: user.id.toString(),
    }));
  } catch (error) {
    console.error("Fetching users failed:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

/**
 * Fetch user by ID
 * @param {string} userId - The user ID to fetch
 * @returns {Promise<Object>} User data with stringified ID
 */
export const fetchUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return {
      ...response.data,
      id: response.data.id.toString(),
    };
  } catch (error) {
    console.error("Fetching user failed:", error);
    throw new Error(
      error.response?.data?.message || `Failed to fetch user ${userId}`
    );
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user data with stringified ID
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return {
      ...response.data,
      id: response.data.id.toString(),
    };
  } catch (error) {
    console.error("Creating user failed:", error);
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

/**
 * Update a user
 * @param {string} userId - The user ID to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data with stringified ID
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return {
      ...response.data,
      id: response.data.id.toString(),
    };
  } catch (error) {
    console.error("Updating user failed:", error);
    throw new Error(
      error.response?.data?.message || `Failed to update user ${userId}`
    );
  }
};

/**
 * Delete a user
 * @param {string} userId - The user ID to delete
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Deleting user failed:", error);
    throw new Error(
      error.response?.data?.message || `Failed to delete user ${userId}`
    );
  }
};

/**
 * Fetch user by email
 * @param {string} email - The email to search for
 * @returns {Promise<Object>} User data with stringified ID
 */
export const fetchUserByEmail = async (email) => {
  try {
    const response = await api.get(`/users/email/${email}`);
    return {
      ...response.data,
      id: response.data.id.toString(),
    };
  } catch (error) {
    console.error("Fetching user by email failed:", error);
    throw new Error(
      error.response?.data?.message ||
        `Failed to fetch user with email ${email}`
    );
  }
};

/**
 * Update user password
 * @param {string} userId - The user ID
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserPassword = async (userId, passwordData) => {
  try {
    const response = await api.patch(`/users/${userId}/password`, passwordData);
    return response.data;
  } catch (error) {
    console.error("Updating password failed:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update password"
    );
  }
};


export const fetchUsersTypesCount = async () => {
  try {
    const response = await api.get("/users/user-types-count");
    return response.data;
  } catch (error) {
    console.error("Fetching user types count failed:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user types count"
    );
  }
}