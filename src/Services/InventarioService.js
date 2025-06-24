
import axios from 'axios';

const BASE_URL = "http://localhost:5067/api/Inventario";

// Función para obtener headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn("Token JWT no encontrado en localStorage.");
    return {};
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener inventario (GET)
export const obtenerInventario = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: getAuthHeaders()
    });
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener inventario:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      alert('No autorizado. Inicia sesión nuevamente.');
    }
    return [];
  }
};

// Crear nuevo artículo (POST)
export const crearInventario = async (item) => {
  try {
    const response = await axios.post(BASE_URL, item, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear artículo de inventario:', error.response?.data || error.message);
    throw error;
  }
};

// Editar artículo existente (PUT)
export const editarInventario = async (item) => {
  try {
    const response = await axios.put(`${BASE_URL}/${item.id}`, item, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al editar artículo de inventario:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar artículo (DELETE)
export const eliminarInventario = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar artículo de inventario:', error.response?.data || error.message);
    throw error;
  }
};
