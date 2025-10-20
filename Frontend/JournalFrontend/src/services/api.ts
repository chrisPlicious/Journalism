import axios from "axios";
import { type JournalEntryCreateDto } from "../models/journal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"; // Default to backend URL

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create
export const createJournal = async (data: JournalEntryCreateDto) => {
  const res = await axios.post(`${API_URL}/journal`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Get all
export const getJournals = async () => {
  const res = await axios.get(`${API_URL}/journal`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Get by id
export const getJournalById = async (id: number) => {
  const res = await axios.get(`${API_URL}/journal/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Update
export const updateJournal = async (
  id: number,
  data: JournalEntryCreateDto
) => {
  const res = await axios.put(`${API_URL}/journal/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Delete
export const deleteJournal = async (id: number) => {
  const res = await axios.delete(`${API_URL}/journal/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Get user profile
export const getProfile = async () => {
  const res = await axios.get(`${API_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Update user profile
export const updateProfile = async (data: any) => {
  const res = await axios.put(`${API_URL}/auth/profile`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Search
export const searchJournals = async (query: string) => {
  const res = await axios.get(`${API_URL}/journal/search`, {
    headers: getAuthHeaders(),
    params: { query },
  });
  return res.data;
};

// Search by title
export const searchJournalsByTitle = async (query: string) => {
  const res = await axios.get(`${API_URL}/journal/search/title`, {
    headers: getAuthHeaders(),
    params: { q: query },
  });
  return res.data;
};

// pin
// Pin
export const journalPin = async (id: number) => {
  return await axios.patch(`${API_URL}/journal/${id}/pin`, null, {
    headers: getAuthHeaders(),
  });
};

// Favorite
export const journalFavorite = async (id: number) => {
  return await axios.patch(`${API_URL}/journal/${id}/favorite`, null, {
    headers: getAuthHeaders(),
  });
};

// Google Sign-In: exchange Google ID token for our JWT
export const googleLogin = async (idToken: string) => {
  const res = await axios.post(`${API_URL}/auth/google`, { idToken });
  return res.data;
};
