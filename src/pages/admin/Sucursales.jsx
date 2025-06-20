import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FiPlus, FiEdit, FiTrash2, FiMapPin } from "react-icons/fi";
import AddSucursalModal from "./modals/AddSucursalModal";
import EditSucursalModal from "./modals/EditSucursalModal";
import DeleteSucursalModal from "./modals/DeleteSucursalModal";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSucursales();
  }, []);

  const fetchSucursales = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sucursal/all", {
        params: { param: "test" },
      });
      setSucursales(res.data);
    } catch (error) {
      console.error("Error cargando sucursales:", error);
      alert("Error al cargar sucursales");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (sucursal) => {
    setSelectedSucursal(sucursal);
    setShowEditModal(true);
  };

  const handleDeleteClick = (sucursal) => {
    setSelectedSucursal(sucursal);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedSucursal(null);
  };

  const filteredSucursales = sucursales.filter(sucursal =>
    sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sucursal.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Gestión de Sucursales</h1>
          <p className="text-gray-600 mt-1">
            Administra las sucursales de tu minimarket
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all shadow-md"
        >
          <FiPlus className="text-lg" />
          Nueva Sucursal
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar sucursales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Sucursales</p>
              <p className="text-2xl font-bold text-gray-800">{sucursales.length}</p>
            </div>
            <FiMapPin className="text-purple-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ciudades</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(sucursales.map(s => s.ciudad)).size}
              </p>
            </div>
            <FiMapPin className="text-green-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Filtradas</p>
              <p className="text-2xl font-bold text-gray-800">{filteredSucursales.length}</p>
            </div>
            <FiMapPin className="text-blue-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-600 py-12">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              Cargando sucursales...
            </div>
          </div>
        ) : filteredSucursales.length === 0 ? (
          <div className="text-center py-12">
            <FiMapPin className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No se encontraron sucursales" : "No hay sucursales registradas"}
            </p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                Intenta con otros términos de búsqueda
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-purple-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Nombre</th>
                  <th className="px-6 py-4 font-semibold">Dirección</th>
                  <th className="px-6 py-4 font-semibold">Ciudad</th>
                  <th className="px-6 py-4 font-semibold">Código</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSucursales.map((sucursal, index) => (
                  <tr
                    key={sucursal.idsucursal}
                    className={`hover:bg-purple-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {sucursal.idsucursal}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-purple-600" size={16} />
                        <span className="font-medium">{sucursal.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={sucursal.direccion}>
                      {sucursal.direccion}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sucursal.ciudad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {sucursal.codigoPropio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(sucursal)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                          title="Editar Sucursal"
                        >
                          <FiEdit size={16} />
                          <span className="hidden sm:inline">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(sucursal)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                          title="Eliminar Sucursal"
                        >
                          <FiTrash2 size={16} />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddSucursalModal
        isOpen={showAddModal}
        onClose={handleCloseModals}
        onAdded={() => {
          handleCloseModals();
          fetchSucursales();
        }}
      />

      <EditSucursalModal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        onUpdated={() => {
          handleCloseModals();
          fetchSucursales();
        }}
        sucursal={selectedSucursal}
      />

      <DeleteSucursalModal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        onDeleted={() => {
          handleCloseModals();
          fetchSucursales();
        }}
        sucursal={selectedSucursal}
      />
    </div>
  );
};

export default Sucursales;