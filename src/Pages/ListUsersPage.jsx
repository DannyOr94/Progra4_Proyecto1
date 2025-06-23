import React, { useEffect, useState } from "react";
import { deleteUser, useUsers } from "../Services/UsersService";
import { SortAsc, SortDesc } from "lucide-react";
import AddGenericModal from "../Components/Modals/AddGenericModal";
import { ConfirmModal } from "../Components/Modals/ConfirmModal";
import EditUsersPage from "./EditUsersPage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ListUsersPage = () => {
  const { data: users, isLoading, isError } = useUsers();
  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const [busquedaInput, setBusquedaInput] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("nis");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ordenCampo, setOrdenCampo] = useState("nis");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  useEffect(() => {
    if (users && Array.isArray(users)) {
      const resultado = aplicarFiltro(users);
      const ordenados = ordenarUsuarios(resultado, ordenCampo, ordenAscendente);
      setUsuariosFiltrados(ordenados);
    }
  }, [users, busqueda, filtro, ordenCampo, ordenAscendente]);

  const aplicarFiltro = (lista) => {
    const texto = busqueda.trim().toLowerCase();
    if (texto === "") return lista;
    return lista.filter((u) =>
      u[filtro]?.toString().toLowerCase().includes(texto)
    );
  };

  const ordenarUsuarios = (lista, campo, ascendente) => {
    return [...lista].sort((a, b) => {
      const valorA = a[campo]?.toString().toLowerCase() || "";
      const valorB = b[campo]?.toString().toLowerCase() || "";
      if (valorA > valorB) return ascendente ? 1 : -1;
      if (valorA < valorB) return ascendente ? -1 : 1;
      return 0;
    });
  };

const eliminarUsuarioConfirmado = () => {
  const id = usuarioSeleccionado?.id;
  if (!id) {
    console.error("ID de usuario no válido para eliminar.");
    return;
  }

  deleteUserMutation(id, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setShowNotification(true);
      setUsuarioSeleccionado(null);      
      setModalVisible(false); 

      setTimeout(() => setShowNotification(false), 1500)
    },
    onError: () => {
      console.error("Error al eliminar el usuario");
    },
  });
};


  const confirmarEliminacion = (user) => {
    setUsuarioSeleccionado(user);
    setModalVisible(true);
  };

  const handleUserUpdated = () => {
    queryClient.invalidateQueries(["users"]);
    setEditModalOpen(false);
  };

  if (isLoading) return <div className="text-center">Cargando usuarios...</div>;

  return (
    <div className="relative max-w-7xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl overflow-hidden">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Lista de Usuarios</h2>

      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg text-center text-sm md:text-base animate-fade-in-out transition duration-500">
            ✅ Usuario eliminado correctamente.
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex w-full md:w-3/5 gap-2">
          <input
            type="text"
            placeholder={`Buscar por ${filtro}`}
            value={busquedaInput}
            onChange={(e) => {
              setBusquedaInput(e.target.value);
              if (e.target.value === "") {
                setBusqueda("");
              }
            }}
            className="flex-grow p-2 border border-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setBusqueda(busquedaInput);
              }
            }}
          />
          <button
            onClick={() => setBusqueda(busquedaInput)}
            className="bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-md"
          >
            Buscar
          </button>
        </div>

        <div className="w-full md:w-1/5">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full p-2 border border-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="nis">NIS</option>
            <option value="cedula">Cédula</option>
            <option value="zona">Zona</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          value={ordenCampo}
          onChange={(e) => setOrdenCampo(e.target.value)}
          className="p-2 border border-blue-400 rounded-md"
        >
          <option value="nis">Ordenar NIS</option>
          <option value="cedula">Ordenar Cédula</option>
          <option value="apellido">Ordenar Apellido</option>
          <option value="nombre">Ordenar Nombre</option>
        </select>
        <button
          onClick={() => setOrdenAscendente(!ordenAscendente)}
          className="bg-teal-800 hover:bg-teal-900 text-white p-1.5 rounded mr-3 shadow"
        >
          {ordenAscendente ? (
            <SortDesc className="inline-block w-5 h-5" />
          ) : (
            <SortAsc className="inline-block w-5 h-5" />
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-300 shadow-sm text-sm">
          <thead className="bg-gray-100 text-gray-800 border-b border-gray-300">
            <tr>
              <th className="border border-gray-300 px-3 py-2">id</th>
              <th className="border border-gray-300 px-3 py-2">NIS</th>
              <th className="border border-gray-300 px-3 py-2">Medidor</th>
              <th className="border border-gray-300 px-3 py-2">Nombre</th>
              <th className="border border-gray-300 px-3 py-2">Apellido</th>
              <th className="border border-gray-300 px-3 py-2">Cédula</th>
              <th className="border border-gray-300 px-3 py-2">Teléfono</th>
              <th className="border border-gray-300 px-3 py-2">Dirección</th>
              <th className="border border-gray-300 px-3 py-2">Correo</th>
              <th className="border border-gray-300 px-3 py-2">Zona</th>
              <th className="border border-gray-300 px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((user) => (
                <tr
                  key={user.id || user.nis}
                  className="text-center border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="border px-2 py-1">{user.id}</td>
                  <td className="border px-2 py-1">{user.nis}</td>
                  <td className="border px-2 py-1">{user.numeroMedidor}</td>
                  <td className="border px-2 py-1">{user.nombre}</td>
                  <td className="border px-2 py-1">{user.apellido}</td>
                  <td className="border px-2 py-1">{user.cedula}</td>
                  <td className="border px-2 py-1">{user.telefono}</td>
                  <td className="border px-2 py-1">{user.direccion}</td>
                  <td className="border px-2 py-1">{user.correo}</td>
                  <td className="border px-2 py-1">{user.zona}</td>
                  <td className="border px-2 py-1">
                    <div className="flex gap-2 justify-center">
                      
                      <button
                        onClick={() => {
                          setUsuarioSeleccionado(user);
                          setEditModalOpen(true);
                        }}
                        className="bg-teal-800 hover:bg-teal-900 text-white text-xs px-3 py-1 rounded-full shadow-sm opacity-90 hover:opacity-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => confirmarEliminacion(user)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <ConfirmModal
          title="¿Eliminar Usuario?"
          message={`Esta acción no se puede deshacer. ¿Eliminar al usuario ${usuarioSeleccionado?.nombre}?`}
          onConfirm={eliminarUsuarioConfirmado}
          onCancel={() => setModalVisible(false)}
        />
      )}

      {editModalOpen && usuarioSeleccionado && (
        <EditUsersPage
          usuario={usuarioSeleccionado}
          onClose={() => setEditModalOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      <AddGenericModal />
    </div>
  );
};

export default ListUsersPage;
