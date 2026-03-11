import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage =
        "Network error. Please check your connection and try again.";
    } else if (error.response.status >= 500) {
      error.userMessage =
        "Something went wrong on our end. Please try again later.";
    } else {
      error.userMessage =
        error.response.data?.message || "An unexpected error occurred.";
    }
    return Promise.reject(error);
  },
);

// Form APIs
export const createForm = (formData) => api.post("/forms", formData);
export const getAllForms = () => api.get("/forms");
export const getFormById = (id) => api.get(`/forms/${id}`);
export const updateForm = (id, formData) => api.put(`/forms/${id}`, formData);
export const deleteForm = (id) => api.delete(`/forms/${id}`);
export const duplicateForm = (id) => api.post(`/forms/${id}/duplicate`);

// Response APIs
export const submitResponse = (payload) => api.post("/responses", payload);
export const getResponsesByForm = (formId) => api.get(`/responses/${formId}`);

export default api;
