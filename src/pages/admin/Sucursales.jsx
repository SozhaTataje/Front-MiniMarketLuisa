import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FiPlus, FiEdit, FiTrash2, FiMapPin } from "react-icons/fi";
import AddSucursalModal from "./modals/SucursalModal/AddSucursalModal";
import EditSucursalModal from "./modals/SucursalModal/EditSucursalModal";
import DeleteSucursalModal from "./modals/SucursalModal/DeleteSucursalModal";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [modal, setModal] = useState({ add: false, edit: false, delete: false });

  useEffect(() => { fetchSucursales(); }, []);

  const fetchSucursales = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sucursal/all", { params: { param: "test" } });
      setSucursales(res.data);
    } catch (err) {
      console.error("Error cargando sucursales:", err);
      alert("Error al cargar sucursales");
    } finally {
      setLoading(false);
    }
  };

  const handleModal = (type, open, sucursal = null) => {
    setModal({ add: false, edit: false, delete: false, [type]: open });
    setSelectedSucursal(sucursal);
  };

  const filtered = sucursales.filter((s) =>
    [s.nombre, s.direccion, s.ciudad].some(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">Gestión de Sucursales</h1>
          <p className="text-gray-600 text-sm sm:text-base">Administra las sucursales de tu minimarket</p>
        </div>
        <button
          onClick={() => handleModal("add", true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 shadow-md text-sm sm:text-base"
        >
          <FiPlus /> Nueva Sucursal
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6 relative max-w-full sm:max-w-md">
        <input
          type="text"
          placeholder="Buscar sucursales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
        />
        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard label="Total Sucursales" value={sucursales.length} color="purple" />
        <StatsCard label="Ciudades" value={new Set(sucursales.map(s => s.ciudad)).size} color="green" />
        <StatsCard label="Filtradas" value={filtered.length} color="blue" />
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState hasSearch={!!searchTerm} />
        ) : (
          <table className="min-w-full text-sm text-left text-gray-600 whitespace-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-purple-100">
              <tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Dirección</Th>
                <Th>Ciudad</Th>
                <Th>Código</Th>
                <Th center>Acciones</Th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-200">
  {filtered.map((s) => (
    <tr
      key={s.idsucursal}
      className="transition-colors bg-white hover:bg-purple-50 sm:table-row flex flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-auto border-b sm:border-none"
    >
      <td className="px-6 py-4 font-semibold sm:hidden">ID:</td>
      <Td>{s.idsucursal}</Td>

      <td className="px-6 py-4 font-semibold sm:hidden">Nombre:</td>
      <Td>
        <div className="flex items-center gap-2">
          <FiMapPin className="text-purple-600" size={16} />
          <span className="font-medium">{s.nombre}</span>
        </div>
      </Td>

      <td className="px-6 py-4 font-semibold sm:hidden">Dirección:</td>
      <Td className="truncate text-wrap">{s.direccion}</Td>

      <td className="px-6 py-4 font-semibold sm:hidden">Ciudad:</td>
      <Td>
        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {s.ciudad}
        </span>
      </Td>

      <td className="px-6 py-4 font-semibold sm:hidden">Código:</td>
      <Td>
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{s.codigoPropio}</span>
      </Td>

      <td className="px-6 py-4 font-semibold sm:hidden">Acciones:</td>
      <Td center>
        <div className="flex justify-center gap-2">
          <ActionButton
            icon={<FiEdit size={16} />}
            label="Editar"
            color="blue"
            onClick={() => handleModal("edit", true, s)}
          />
          <ActionButton
            icon={<FiTrash2 size={16} />}
            label="Eliminar"
            color="red"
            onClick={() => handleModal("delete", true, s)}
          />
        </div>
      </Td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      </div>

      {/* Modales */}
      <AddSucursalModal
        isOpen={modal.add}
        onClose={() => handleModal("add", false)}
        onAdded={() => { handleModal("add", false); fetchSucursales(); }}
      />
      <EditSucursalModal
        isOpen={modal.edit}
        onClose={() => handleModal("edit", false)}
        onUpdated={() => { handleModal("edit", false); fetchSucursales(); }}
        sucursal={selectedSucursal}
      />
      <DeleteSucursalModal
        isOpen={modal.delete}
        onClose={() => handleModal("delete", false)}
        onDeleted={() => { handleModal("delete", false); fetchSucursales(); }}
        sucursal={selectedSucursal}
      />
    </div>
  );
};

// Reutilizables
const Th = ({ children, center }) => (
  <th className={`px-4 py-3 font-semibold ${center ? "text-center" : "text-left"}`}>{children}</th>
);
const Td = ({ children, center }) => (
  <td className={`px-4 py-3 ${center ? "text-center" : "text-left"}`}>{children}</td>
);

const StatsCard = ({ label, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: `${color}` }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <FiMapPin className={`text-${color}-500`} size={28} />
    </div>
  </div>
);

const ActionButton = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 text-${color}-600 hover:text-${color}-800 hover:bg-${color}-50 px-2 py-1 rounded transition-colors`}
    title={label}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const LoadingState = () => (
  <div className="text-center text-gray-600 py-12">
    <div className="inline-flex items-center gap-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
    </div>
  </div>
);

const EmptyState = ({ hasSearch }) => (
  <div className="text-center py-12">
    <FiMapPin className="mx-auto text-gray-400 mb-4" size={48} />
    <p className="text-gray-500 text-lg">
      {hasSearch ? "No se encontraron sucursales" : "No hay sucursales registradas"}
    </p>
    {hasSearch && (
      <p className="text-gray-400 text-sm mt-2">Intenta con otros términos de búsqueda</p>
    )}
  </div>
);

export default Sucursales;
