import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((req) => {
  
  let token = localStorage.getItem("token");

   console.log("TOKEN =", token);
  
  if (token) {
    
   token = token.replace(/"/g, "");
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;