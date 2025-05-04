import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.example.com"; // Replace with your actual API URL

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
