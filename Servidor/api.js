import axios from "axios";

//const API_URL = "http://api-eventoslanzarote.api/api"; // Cambia esto según tu backend
const API_URL = "http://eventoslanzarote.es/api/api";

// Configuración de Axios con la base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir el token de autenticación si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // O usa un estado global (Redux, Zustand, etc.)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exporta la instancia de Axios por si necesitas usarla directamente
export default api;


/*const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://tu-backend.com/api'   // URL de producción
    : 'http://localhost:8000/api',    // URL de desarrollo
  headers: { 'Content-Type': 'application/json' },
}); */