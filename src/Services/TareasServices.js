import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { client as axiosClient } from '../Services/AuthService';
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:5067/api/Tareas";

export const useObtenerTareas = () => {
  return useQuery({
    queryKey: ['tareas'],
    queryFn: async () => {
      const response = await axiosClient.get(BASE_URL);
      return response.data || [];
    }
  });
};

export const useCrearTarea = (options) => {
  return useMutation({
    mutationFn: async (tarea) => {
      await axiosClient.post(BASE_URL, tarea);
    },
    ...options
  });
};

export const useEditarTarea = () => {
  return useMutation({
    mutationFn: async (tarea) => {
      await axiosClient.put(`${BASE_URL}/${tarea.id}`, tarea);
    }
  });
};

export const eliminarTarea = async (id) => {
  try {
    await axiosClient.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
};


