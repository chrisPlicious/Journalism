import axios from 'axios';
import { type JournalEntryCreateDto } from '../models/journal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'; // Default to backend URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
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
export const updateJournal = async (id: number, data: JournalEntryCreateDto) => {
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
