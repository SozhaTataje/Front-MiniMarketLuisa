import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import RegisterUserModal from "./modals/RegisterUserModal";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/usuario/all");
      console.log("Usuarios recibidos:", res.data);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">Usuarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <FiPlus className="mr-2" /> Registrar Usuario
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-4">
      {loading ? (
        <p className="text-center text-gray-500">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-purple-100">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((u, idx) => (
                  <tr
                    key={u.idusuario || u.email}
                    className={idx % 2 === 0 ? "bg-white" : "bg-purple-50"}
                  >
                    <td className="p-2">{u.idusuario}</td>
                    <td className="p-2">{u.nombre}</td>
                    <td className="p-2">{u.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
</div>
      <RegisterUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUserAdded={fetchUsuarios}
      />
    </div>
  );
};

export default Usuarios;
