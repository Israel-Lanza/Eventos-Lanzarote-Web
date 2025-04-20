import axios from "axios";


const API_URL = "https://eventoslanzarote.es/api/api";

//Configuración de Axios con la base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getCsrfCookie = () => {
  return axios.get("https://eventoslanzarote.es/api/sanctum/csrf-cookie", {
    withCredentials: true,
  });
};

//Interceptor para incluir el token de autenticación si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); //O usa un estado global (Redux, Zustand, etc.)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Exporta la instancia de Axios por si necesitas usarla directamente
export default api;