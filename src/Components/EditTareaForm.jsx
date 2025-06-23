import { useState, useEffect } from "react";
import { useEditarTarea } from "../Services/TareasServices";
import { ToastContainer, toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import 'react-toastify/dist/ReactToastify.css';

const EditTareaForm = ({ tarea, onSuccess }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: tarea.id,
    description: tarea.description,
    startDate: tarea.startDate,
    endDate: tarea.endDate,
    perInCharge: tarea.perInCharge,
    priority: tarea.priority
  });

  useEffect(() => {
    if (tarea) {
      setFormData(tarea);
    }
  }, [tarea]);

  const { mutate } = useEditarTarea();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.startDate > formData.endDate) {
      toast.error("La fecha de inicio no puede ser despues de la fecha final.");
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        toast.success("Tarea editada.");
        if (onSuccess) onSuccess();
        queryClient.invalidateQueries(['tareas']);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Descripción</label>
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Fecha de inicio</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Fecha de fin</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Persona a cargo</label>
        <input
          name="perInCharge"
          value={formData.perInCharge}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Nivel de prioridad</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Seleccione</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 rounded-lg"
      >
        Guardar cambios
      </button>
    </form>
  );

};

export default EditTareaForm;
