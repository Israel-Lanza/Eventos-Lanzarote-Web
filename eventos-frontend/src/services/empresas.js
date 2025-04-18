import api from "./api";

//Función para obtener eventos desde Laravel
export const getEmpresas = async () => {
  try {
    const response = await api.get("/empresas"); // Solicitud GET a Laravel
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};

//Función para obtener una empresa por ID
export const getEmpresaById = async (id) => {
  try {
    const response = await api.get(`/empresas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo la empresa:", error);
    return null; //Retorna null si hay error
  }
};

//Función para crear una nueva empresa
export const createEmpresa = async (empresaData) => {
  const response = await api.post("/empresas", empresaData);
  return response.data;
};

//Función para actualizar una empresa existente
export const updateEmpresa = async (id, empresaData) => {
  const response = await api.put(`/empresas/${id}`, empresaData);
  return response.data;
  
  /* try {
    
  } catch (error) {
    console.error("Error actualizando la empresa:", error);
    return null;
  } */
};

//Función para eliminar una empresa
export const deleteEmpresa = async (id) => {
  try {
    await api.delete(`/empresas/${id}`);
    return true; //Indica que se eliminó correctamente
  } catch (error) {
    console.error("Error eliminando la empresa:", error);
    return false;
  }
};