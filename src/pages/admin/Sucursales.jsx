import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FiPlus, FiEdit, FiTrash2, FiMapPin } from "react-icons/fi";
import AddSucursalModal from "./modals/SucursalModal/AddSucursalModal";
import EditSucursalModal from "./modals/SucursalModal/EditSucursalModal";
import DeleteSucursalModal from "./modals/SucursalModal/DeleteSucursalModal";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Sucursales</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{sucursales.length}</p>
            </div>
            <FiMapPin className="text-purple-500" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ciudades</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{new Set(sucursales.map(s => s.ciudad)).size}</p>
            </div>
            <FiMapPin className="text-green-500" size={28} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        {loading ? (
          <div className="text-center text-gray-600 py-12">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          </div>
        ) : sucursales.length === 0 ? (
          <div className="text-center py-12">
            <FiMapPin className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No hay sucursales registradas</p>
          </div>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-600 whitespace-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-purple-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-left">ID</th>
                <th className="px-4 py-3 font-semibold text-left">Nombre</th>
                <th className="px-4 py-3 font-semibold text-left">Dirección</th>
                <th className="px-4 py-3 font-semibold text-left">Ciudad</th>
                <th className="px-4 py-3 font-semibold text-left">Código</th>
                <th className="px-4 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sucursales.map((s) => (
                <tr
                  key={s.idsucursal}
                  className="transition-colors bg-white hover:bg-purple-50 sm:table-row flex flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-auto border-b sm:border-none"
                >
                  <td className="px-6 py-4 font-semibold sm:hidden">ID:</td>
                  <td className="px-4 py-3 text-left">{s.idsucursal}</td>

                  <td className="px-6 py-4 font-semibold sm:hidden">Nombre:</td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-purple-600" size={16} />
                      <span className="font-medium">{s.nombre}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold sm:hidden">Dirección:</td>
                  <td className="px-4 py-3 truncate text-wrap">{s.direccion}</td>

                  <td className="px-6 py-4 font-semibold sm:hidden">Ciudad:</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {s.ciudad}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold sm:hidden">Código:</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{s.codigoPropio}</span>
                  </td>

                  <td className="px-6 py-4 font-semibold sm:hidden">Acciones:</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleModal("edit", true, s)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={16} />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => handleModal("delete", true, s)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        title="Eliminar"
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
        )}
      </div>

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

export default Sucursales;
