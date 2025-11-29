import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL ?? "https://aiary-cproject-render-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("Attaching token to request:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
