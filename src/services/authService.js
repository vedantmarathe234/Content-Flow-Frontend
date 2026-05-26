import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {

    req.headers.Authorization =
      `Bearer ${token}`;
  }

  return req;
});

export const loginUser = (data) =>
  API.post("/login", data);

export const registerUser = (data) =>
  API.post("/register", data);

export const forgotPassword = (email) =>
  API.post("/forgot-password", {
    email
  });

export const resetPassword = (data) =>
  API.post("/reset-password", data);