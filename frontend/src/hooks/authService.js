// 
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL; // adjust if deployed

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  return res.data;
};

export const signupUser = async (name, email, password) => {
  const res = await axios.post(`${API_BASE}/signup`, { name, email, password });
  return res.data;
};

export const getUserFromToken = async (token) => {
  const res = await axios.get(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
