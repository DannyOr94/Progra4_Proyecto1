import { useState, useEffect } from "react";
import { useEditarTarea } from "../Services/TareasServices";
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import 'react-toastify/dist/ReactToastify.css';
import { NotificationToast } from './Toast';

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

  const { mutateAsync } = useEditarTarea();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startDate > formData.endDate) {
      toast.error("La fecha de inicio no puede ser despues de la fecha final.");
      return;
    }

    try {
      await toast.promise(
        mutateAsync(formData),
        {
          pending: 'Agregando...',
          success: 'Agregado correctamente ✅',
          error: 'Ocurrió un error ❌'
        },
        { position: 'top-right', autoClose: 1500 }
      );
      if (onSuccess) onSuccess();
      queryClient.invalidateQueries(['tareas']);
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Descripción</label>
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div>
        <label className="form-label">Fecha de inicio</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div>
        <label className="form-label">Fecha de fin</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div>
        <label className="form-label">Persona a cargo</label>
        <input
          name="perInCharge"
          value={formData.perInCharge}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div>
        <label className="form-label">Nivel de prioridad</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-input"
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
        className="form-button"
      >
        Guardar cambios
      </button>
    </form>
      <NotificationToast />
  );

};

export default EditTareaForm;
