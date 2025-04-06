import api from "./api";

//Función para obtener eventos desde Laravel
export const getEventos = async () => {
  try {
    const response = await api.get("/eventos"); // Solicitud GET a Laravel
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};

export const getAllEvents = async (autor) => {
  try {
    const response = await api.get(`/eventos/all/${autor}`); // Solicitud GET a Laravel
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

//Función para obtener un evento por ID
export const getEventoById = async (nombreEvento) => {
    try {
      const response = await api.get(`/eventos/${nombreEvento}`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo el evento:", error);
      return null; // Retorna null si hay error
    }
};
  
  //Función para crear un nuevo evento
export const createEvento = async (eventoData) => {
  try {
    console.log(eventoData);
    const response = await api.post("/eventos", eventoData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creando el evento:", error);
    return null;
  }
};
  
  //Función para actualizar un evento existente
export const updateEvento = async (id, eventoData) => {
  try {
    const response = await api.put(`/eventos/${id}`, eventoData);
    return response.data;
  } catch (error) {
    console.error("Error actualizando el evento:", error);
    return null;
  }
};
  
  /*//Función para eliminar un evento
  export const deleteEvento = async (id) => {
    try{
      await api.delete(`/eventos/${id}`);
      return true; // Indica que se eliminó correctamente
    }catch(error) {
      console.error("Error eliminando el evento:", error);
      return false;
    }
  };*/

export const deleteEvento = async (id) => {
  try {
    const response = await api.delete(`/eventos/${id}`);
    console.log("Evento eliminado:", response.data);
    return true;
  } catch (error) {
    if (error.response) {
      console.error("Error eliminando el evento:", {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.error("Error eliminando el evento:", error.message);
    }
    return false;
  }
};


export const buscarEventosPorNombre = async (nombre) => {
  try {
    const response = await api.get(`/eventos/buscar?nombre=${encodeURIComponent(nombre)}`);
    return response.data;
  } catch (error) {
    console.error("Error buscando eventos por nombre:", error);
    return [];
  }
};



export const cambiarEstadoEvento = async (id, estado) => {
  try {
    const response = await api.patch(`/eventos/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del evento:", error);
    return null;
  }
};


export const getResumenEventos = async (autor) => {
  try {
    const response = await api.get(`/eventos/resumen/${autor}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el resumen de eventos:", error);
    return { total: 0, activos: 0, pendientes: 0, denegados: 0 };
  }
};

export const getDashboardData = async () => {
  try {
      const res = await api.get("/dashboard-data");
      return res.data;
  } catch (error) {
      console.error("Error cargando datos del dashboard", error);
      return null;
  }
};


  