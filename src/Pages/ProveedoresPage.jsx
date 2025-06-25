import React, { useEffect, useState } from 'react';
import ProveedorList from '../Components/ProveedorList';
import {
  obtenerProveedores,
  crearProveedor,
  editarProveedor,
  eliminarProveedor
} from '../Services/ProveedoresService';
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import Login from "../Components/Login";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationToast } from '../Components/Toast';

function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function cargar() {
      const data = await obtenerProveedores();
      setProveedores(data);
    }
    cargar();
  }, []);

  const guardar = async (evento) => {
    evento.preventDefault();

    const form = evento.target;

    const nuevoProveedor = {
      nombreEmpresa: form.nombreEmpresa.value.trim(),
      nombreRepresentante: form.nombreRepresentante.value.trim(),
      cedulaRepresentante: form.cedulaRepresentante.value.trim(),
      correoEmpresa: form.correoEmpresa.value.trim(),
      telefonoEmpresa: form.telefonoEmpresa.value.trim(),
      descripcionProductos: form.descripcionProductos.value.trim(),
      numeroCuenta: form.numeroCuenta.value.trim(),
    };

    const validacion = Object.values(nuevoProveedor).every(Boolean);
    if (!validacion) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    let nuevaLista;
    if (proveedorEditando) {
      nuevoProveedor.id = proveedorEditando.id;
      nuevaLista = proveedores.map((p) => (p.id === proveedorEditando.id ? nuevoProveedor : p));
      await editarProveedor(nuevoProveedor);
      toast.success("Proveedor editado correctamente.");
    } else {

      await crearProveedor(nuevoProveedor);
      const dataActualizada = await obtenerProveedores();
      nuevaLista = dataActualizada;
      toast.success("Proveedor agregado correctamente.");
    }

    setProveedores(nuevaLista);
    setProveedorEditando(null);
    setShowModal(false);
    form.reset();
  };



  const editar = (prov) => {
    setProveedorEditando(prov);
    setShowModal(true);
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proveedor?')) return;

    const nuevaLista = proveedores.filter((p) => p.id !== id);
    setProveedores(nuevaLista);

    await eliminarProveedor(id);
    toast.success("Proveedor eliminado correctamente.");
  };



  const cancelForm = () => {
    setProveedorEditando(null);
    setShowModal(false);
  };

  const filtrados = proveedores.filter((p) =>
    Object.values(p)
      .join(' ')
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  const { user } = useContext(AuthContext)
  
  return (
    <div>
      {user ? <div className="p-4">
        <div className="p-6 w-full mx-auto bg-white min-h-screen">
           <NotificationToast />
          <h1 className="text-2xl font-bold mb-4">Gestión de Proveedores</h1>

          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar proveedores..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="form-input w-64"
            />
            <button
              onClick={() => {
                setProveedorEditando(null);
                setShowModal(true);
              }}
              className="form-button"
            >
              Agregar Proveedor
            </button>
          </div>

          <ProveedorList proveedores={filtrados} onEditar={editar} onEliminar={eliminar} />
          <NotificationToast />

          {showModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 overflow-auto">
              <div className="bg-gradient-to-r from-teal-900 to-teal-600 p-1 rounded-xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-4 my-8">
                <div className="bg-white p-6 rounded shadow-lg max-h-screen overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    {proveedorEditando ? 'Editar Proveedor' : 'Agregar Proveedor'}
                  </h2>
                  <form onSubmit={guardar} className="space-y-4">
                  <div>
                    <label className="form-label">Nombre de la Empresa</label>
                    <input
                      type="text"
                      name="nombreEmpresa"
                      defaultValue={proveedorEditando?.nombreEmpresa || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Nombre del Representante</label>
                    <input
                      type="text"
                      name="nombreRepresentante"
                      pattern="^[^\d]+$"
                      title="No se permiten números"
                      defaultValue={proveedorEditando?.nombreRepresentante || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Cédula del Representante</label>
                    <input
                      type="text"
                      name="cedulaRepresentante"
                      pattern="\d+"
                      title="Solo se permiten números"
                      defaultValue={proveedorEditando?.cedulaRepresentante || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Correo de la Empresa</label>
                    <input
                      type="email"
                      name="correoEmpresa"
                      defaultValue={proveedorEditando?.correoEmpresa || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Teléfono de la Empresa</label>
                    <input
                      type="text"
                      name="telefonoEmpresa"
                      pattern="\d+"
                      title="Solo se permiten números"
                      defaultValue={proveedorEditando?.telefonoEmpresa || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Descripción de Productos</label>
                    <input
                      type="text"
                      name="descripcionProductos"
                      defaultValue={proveedorEditando?.descripcionProductos || ''}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Número de Cuenta</label>
                    <input
                      type="text"
                      name="numeroCuenta"
                      defaultValue={proveedorEditando?.numeroCuenta || ''}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="form-button-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#009285] text-white px-4 py-2 rounded hover:bg-[#055a55]"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
        : <Login />
      }
    </div>

  );
}

export default ProveedoresPage;
