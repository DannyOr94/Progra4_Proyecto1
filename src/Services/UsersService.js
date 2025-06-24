import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:5067/api/Users';

// Función para obtener headers con el token JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Obtener usuarios desde API
export const fetchUsers = async () => {
  try {
    const response = await axios.get(BASE_URL, { headers: getAuthHeaders() });
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Hook para usar usuarios con React Query
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Agregar usuario
export const addUser = async (newUser) => {
  try {
    const response = await axios.post(BASE_URL, newUser, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${userId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

// Editar usuario
export const updateUser = async (updatedUser) => {
  try {
    const response = await axios.put(`${BASE_URL}/${updatedUser.id}`, updatedUser, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

