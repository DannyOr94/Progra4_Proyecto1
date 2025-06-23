import { useForm } from '@tanstack/react-form'
import { useCrearTarea } from '../Services/TareasServices'
import { ToastContainer, toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import 'react-toastify/dist/ReactToastify.css';


const AddTareaForm = () => {
  const queryClient = useQueryClient()

  // 1) grab your mutation
 const { mutate: addTarea, isLoading, isError } = useCrearTarea({
    onSuccess: () => {
      toast.success("Tarea agregada.")
      queryClient.invalidateQueries(['tareas'])
      form.reset()
    },
    onError: () => {
      toast.error("Ocurrió un error al agregar la tarea.")
    }
  })

     // 1️⃣ Initialize form state with defaultValues and a submit handler
  const form = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
      perInCharge: '',
      description: '',
      priority: '',
    },
    
onSubmit: async ({ value }) => {
  const { startDate, endDate } = value;

  // Validación manual directa
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    toast.error('La fecha de inicio no puede ser posterior a la fecha final.');
    return;
  }

  const nuevaTarea = {
    ...value,
    id: crypto.randomUUID(),
  };

  addTarea(nuevaTarea);
}

      
  })

    return (
        <form
        className="space-y-6"
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >


{/* ─── description Field ─────────────────────── */}
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 text-gray-700 font-medium">
            ¿Cual es la tarea?:
          </label>
          <form.Field name="description">
            {field => (
              <input
                id="description"
                name="description"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </form.Field>
        </div>

      
        {/* ─── startDate Field ─────────────────────── */}
        <div className="flex flex-col">
          <label htmlFor="startDate" className="mb-1 text-gray-700 font-medium">
            Fecha de inicio:
          </label>
          <form.Field name="startDate">
            {field => (
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </form.Field>
        </div>
      
        {/* ─── endDate Field ────────────────────── */}
        <div className="flex flex-col">
          <label htmlFor="endDate" className="mb-1 text-gray-700 font-medium">
            Fecha final:
          </label>
          <form.Field name="endDate">
            {field => (
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </form.Field>
        </div>
      
        {/* ─── Person in charge Field ─────────────────────── */}
        <div className="flex flex-col">
          <label htmlFor="perInCharge" className="mb-1 text-gray-700 font-medium">
            Persona a cargo:
          </label>
          <form.Field name="perInCharge">
            {field => (
              <input
                id="perInCharge"
                name="perInCharge"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </form.Field>
        </div>

        
      {/* ─── Priority Field ─────────────────────── */}
<div className="flex flex-col">
  <label htmlFor="priority" className="mb-1 text-gray-700 font-medium">
    Nivel de prioridad:
  </label>
  <form.Field name="priority">
    {field => (
      <select
        id="priority"
        name="priority"
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Selecciona una prioridad</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
    )}
  </form.Field>
</div>

        {/* ─── Buttons ────────────────────────── */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={!form.state.canSubmit}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 rounded-lg"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={() => form.reset()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Limpiar
          </button>
        </div>
      </form>      
    )
}

export default AddTareaForm;