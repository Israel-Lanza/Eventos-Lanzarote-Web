import api from "./api";

// 🔥 Función para obtener eventos desde Laravel
export const getEventos = async () => {
  try {
    const response = await api.get("/eventos"); // Solicitud GET a Laravel
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};

export const getEventosCategory = async (categoria) => {
  try {
    const response = await api.get(`eventos/categoria/${categoria}`); // Solicitud GET a Laravel
    
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};

// 🔥 Función para obtener un evento por ID
export const getEventoById = async (id) => {
    try {
      const response = await api.get(`/eventos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo el evento:", error);
      return null; // Retorna null si hay error
    }
  };
  
  // 🔥 Función para crear un nuevo evento
  export const createEvento = async (eventoData) => {
    try {
      const response = await api.post("/eventos", eventoData);
      return response.data;
    } catch (error) {
      console.error("Error creando el evento:", error);
      return null;
    }
  };
  
  // 🔥 Función para actualizar un evento existente
  export const updateEvento = async (id, eventoData) => {
    try {
      const response = await api.put(`/eventos/${id}`, eventoData);
      return response.data;
    } catch (error) {
      console.error("Error actualizando el evento:", error);
      return null;
    }
  };
  
  // 🔥 Función para eliminar un evento
  export const deleteEvento = async (id) => {
    try {
      await api.delete(`/eventos/${id}`);
      return true; // Indica que se eliminó correctamente
    } catch (error) {
      console.error("Error eliminando el evento:", error);
      return false;
    }
  };