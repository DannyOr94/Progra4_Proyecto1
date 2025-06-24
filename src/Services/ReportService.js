import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = "http://localhost:5067/api/Reportes";

export const fetchReportes = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const useReportes = () => {
  return useQuery({
    queryKey: ['reportes'],
    queryFn: fetchReportes,
    staleTime: 1000 * 60 * 10,
  });
};

export const useAddReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevo) => {
      if (!nuevo || !nuevo.id || !nuevo.nombre || !nuevo.direccion) {
        throw new Error("Faltan campos obligatorios en el reporte.");
      }
      await axios.post(BASE_URL, nuevo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useDeleteReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!id) throw new Error("ID inválido");
      await axios.delete(`${BASE_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};
