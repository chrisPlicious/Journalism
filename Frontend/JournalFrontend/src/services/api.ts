import axios from "axios";
import { type JournalEntryCreateDto } from "../models/journal";
import { type UserProfileUpdateDto } from "../models/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create Axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor — inject Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 (expired/invalid token)
// Skip redirect for auth endpoints (login, signup, google) so those
// pages can handle 401 errors themselves.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/google");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("avatarUrl");
      localStorage.removeItem("isProfileComplete");
      sessionStorage.removeItem("profileDialogShown");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth — login
export const loginUser = async (formData: {
  loginIdentifier: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
};

// Auth — register
export const registerUser = async (formData: {
  FirstName: string;
  LastName: string;
  Gender: string;
  DateOfBirth: string;
  Email: string;
  Username: string;
  Password: string;
  ConfirmPassword: string;
}) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};

// Auth — Google Sign-In
export const googleLogin = async (idToken: string) => {
  const res = await api.post("/auth/google", { idToken });
  return res.data;
};

// Create
export const createJournal = async (data: JournalEntryCreateDto) => {
  const res = await api.post("/journal", data);
  return res.data;
};

// Get all
export const getJournals = async () => {
  const res = await api.get("/journal");
  return res.data;
};

// Get by id
export const getJournalById = async (id: number) => {
  const res = await api.get(`/journal/${id}`);
  return res.data;
};

// Update
export const updateJournal = async (
  id: number,
  data: JournalEntryCreateDto
) => {
  const res = await api.put(`/journal/${id}`, data);
  return res.data;
};

// Delete
export const deleteJournal = async (id: number) => {
  const res = await api.delete(`/journal/${id}`);
  return res.data;
};

// Get user profile
export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Update user profile
export const updateProfile = async (data: UserProfileUpdateDto) => {
  const res = await api.put("/auth/profile", data);
  return res.data;
};

// Search
export const searchJournals = async (query: string) => {
  const res = await api.get("/journal/search", {
    params: { query },
  });
  return res.data;
};

// Search by title
export const searchJournalsByTitle = async (query: string) => {
  const res = await api.get("/journal/search/title", {
    params: { q: query },
  });
  return res.data;
};

// Pin
export const journalPin = async (id: number) => {
  return await api.patch(`/journal/${id}/pin`);
};

// Favorite
export const journalFavorite = async (id: number) => {
  return await api.patch(`/journal/${id}/favorite`);
};
