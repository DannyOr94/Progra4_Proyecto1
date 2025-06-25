import { useState, useMemo, useEffect, useContext } from 'react';
import { useReportes, useDeleteReporte } from '../Services/ReportService';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { LoadingModal } from './Modals/LoadingModal';
import { SuccessModal } from './Modals/SuccessModal';
import { ConfirmModal } from './Modals/ConfirmModal';
import { AuthContext } from '../Context/AuthContext';
import { useRouter } from '@tanstack/react-router'; 

const formatFechaHora = (isoString) => {
  const fecha = new Date(isoString);
  return fecha.toLocaleString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default function ReportTable() {
  const { user } = useContext(AuthContext);
  const router = useRouter(); 

  // 🔐 Redirigir si no está autenticado
  
  useEffect(() => {
    if (!user) {
      router.navigate({ to: '/login' });
    }
  }, [user, router]);

  const { data: reportes = [], isLoading, isError } = useReportes();
  const { mutate: deleteReporte } = useDeleteReporte();

  const [toDeleteId, setToDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleConfirmDelete = () => {
    if (!toDeleteId) return;
    setShowConfirm(false);
    setShowLoading(true);

    deleteReporte(toDeleteId, {
      onSuccess: () => {
        setShowLoading(false);
        setSuccessMsg('Reporte eliminado correctamente');
        setShowSuccess(true);
      },
      onError: () => {
        setShowLoading(false);
        alert('❌ Error al eliminar el reporte');
      },
    });
  };

  const filteredReportes = useMemo(() => {
    if (!searchTerm) return reportes;

    const term = searchTerm.toLowerCase();
    return reportes.filter((reporte) => {
      const base = Object.values(reporte).join(' ').toLowerCase();
      return (
        base.includes(term) ||
        formatFechaHora(reporte.fechaHora).toLowerCase().includes(term)
      );
    });
  }, [reportes, searchTerm]);

  const columns = [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Dirección', accessorKey: 'direccion' },
    { header: 'Tipo', accessorKey: 'tiporeporte' },
    { header: 'Descripción', accessorKey: 'descripcionFuga' },
    { header: 'Ubicación', accessorKey: 'ubicacionReferencia' },
    {
      header: 'Fecha y hora',
      accessorKey: 'fechaHora',
      cell: ({ row }) => (
        <span>{formatFechaHora(row.original.fechaHora)}</span>
      ),
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <button
          onClick={() => {
            setToDeleteId(row.original.id);
            setShowConfirm(true);
          }}
          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
          Eliminar
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredReportes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p className="p-4">Cargando reportes...</p>;
  if (isError) return <p className="p-4 text-red-600">Error al cargar los reportes.</p>;

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow border border-green-200">
        <h2 className="text-2xl font-bold mb-6 text-[#00796B] text-center uppercase tracking-wide">
          Reportes Registrados
        </h2>

        <div className="mb-4 flex items-center gap-2 max-w-sm">
          <input
            type="text"
            placeholder="Buscar reporte..."
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredReportes.length === 0 ? (
          <p className="text-center text-red-600 font-semibold">
            No se encontraron reportes que coincidan con la búsqueda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-green-300 text-sm">
              <thead className="bg-teal-700 text-white">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 text-left border-b border-green-200"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-green-100 ${
                      index % 2 === 0 ? 'bg-green-50' : 'bg-cyan-50'
                    } hover:bg-cyan-100 transition`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 text-green-900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showLoading && <LoadingModal />}
      {showSuccess && (
        <SuccessModal
          message={successMsg}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showConfirm && (
        <ConfirmModal
          title="¿Estás seguro?"
          message="Esta acción eliminará el reporte permanentemente."
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
