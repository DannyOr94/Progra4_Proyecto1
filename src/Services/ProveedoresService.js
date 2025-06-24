import axios from 'axios';

const API_KEY = import.meta.env.VITE_MASTER_KEY_Proveedores;
const BASE_URL = "http://localhost:5067/api/Proveedores";
const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
};

export const obtenerProveedores = async () => {
  try {
    const response = await axios.get(BASE_URL, { headers });
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return [];
  }
};

export const crearProveedor = async (proveedor) => {
  try {
    await axios.post(BASE_URL, proveedor, { headers });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
  }
};

export const editarProveedor = async (proveedor) => {
  try {
    await axios.put(`${BASE_URL}/${proveedor.id}`, proveedor, { headers });
  } catch (error) {
    console.error('Error al editar proveedor:', error);
  }
};

export const eliminarProveedor = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`, { headers });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
  }
};
