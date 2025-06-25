import React, { useState } from "react";

const UserForm = ({ formData, handleChange, handleSubmit, modo = "Agregar" }) => {
  const [alerta, setAlerta] = useState("");

  if (!formData) return <div className="p-4">Cargando datos...</div>;

  const handleValidatedChange = (e) => {
    const { name, value } = e.target;

    // Validación para Nombre y Apellido
    if ((name === "nombre" || name === "apellido") && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
      setAlerta(`Solo se permiten letras en el campo ${name}`);
      setTimeout(() => setAlerta(""), 2500);
      return;
    }

    handleChange(e);
  };

  return (
    <div className="bg-gradient-to-r from-teal-900 to-teal-600 p-1 rounded-xl max-w-3xl mx-auto mt-3 mb-6 p-6 bg-white shadow-xl rounded-xl border border-teal-700">
      <div className="bg-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          {modo} Usuario
        </h2>

        {alerta && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {alerta}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { label: "NIS", name: "nis" },
            { label: "Número de Medidor", name: "numeroMedidor" },
            { label: "Nombre", name: "nombre" },
            { label: "Apellido", name: "apellido" },
            { label: "Cédula", name: "cedula" },
            { label: "Teléfono", name: "telefono" },
            { label: "Zona", name: "zona" },
            { label: "Correo", name: "correo", type: "email" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleValidatedChange}
                autoComplete="off"
                className="form-input mt-1"
                required={name !== "zona"}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion || ""}
              onChange={handleChange}
              autoComplete="off"
              className="form-input mt-1"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="form-button"
            >
              Guardar
            </button>
            <button
              type="button"
              className="form-button-secondary"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;