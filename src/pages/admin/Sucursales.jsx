import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FiPlus } from "react-icons/fi";
import AddSucursalModal from "./modals/AddSucursalModal";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSucursalModal, setShowSucursalModal] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Gestión de Sucursales</h1>
        <button
          onClick={() => setShowSucursalModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          <FiPlus className="text-lg" /> Nueva Sucursal
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        {loading ? (
          <div className="text-center text-gray-600 py-10">Cargando sucursales...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-purple-100">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Dirección</th>
                </tr>
              </thead>
              <tbody>
                {sucursales.length > 0 ? (
                  sucursales.map((s, i) => (
                    <tr
                      key={s.idsucursal}
                      className={`border-b hover:bg-purple-50 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2">{s.idsucursal}</td>
                      <td className="px-4 py-2">{s.nombre}</td>
                      <td className="px-4 py-2">{s.direccion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">
                      No hay sucursales registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddSucursalModal
        isOpen={showSucursalModal}
        onClose={() => setShowSucursalModal(false)}
        onAdded={() => {
          setShowSucursalModal(false);
          fetchSucursales();
        }}
      />
    </div>
  );
};

export default Sucursales;
