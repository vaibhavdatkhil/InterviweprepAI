// src/services/authService.ts
import axios from "axios";

// Auth routes don't need a token, so they use
// a plain axios instance (not the shared one with interceptors)
const authAPI = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api") + "/auth",
});

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await authAPI.post("/register", data);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await authAPI.post("/login", data);
  return response.data;
};
