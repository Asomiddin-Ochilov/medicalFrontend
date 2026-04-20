import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
   headers: {
    "Content-Type": "application/json"
  }
});
// http://localhost:5173
// https://medical-1-t624.onrender.com
// https://api.gsoft.uz/

// https://apimedical.site
//  "http://76.13.77.216:5000/api",
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("med_auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;