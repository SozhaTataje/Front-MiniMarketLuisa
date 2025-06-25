import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import RegisterUserModal from "./modals/UsuariosModal/RegisterUserModal";
import { FiPlus, FiSearch, FiUsers, FiMail, FiPhone, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/usuario/all");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter((u) =>
    `${u.nombre} ${u.email} ${u.telefono}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAdded = () => {
    setShowRegisterModal(false);
    toast.success("Usuario registrado correctamente");
    fetchUsuarios();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-full">
            <FiUsers className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 shadow-lg"
        >
          <FiPlus /> Nuevo Usuario
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full"><FiUsers /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Filtrados</p>
              <p className="text-2xl font-bold text-gray-800">{filteredUsuarios.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full"><FiSearch /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Activos</p>
              <p className="text-2xl font-bold text-gray-800">{usuarios.filter(u => u.email).length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full"><FiMail /></div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex items-center gap-3">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
              <FiX />
            </button>
          )}
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Cargando usuarios...</span>
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="mt-2 text-purple-600 hover:text-purple-700 font-medium">
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-medium text-purple-700 uppercase tracking-wider text-left">Nombre Completo</th>
                  <th className="px-6 py-4 text-xs font-medium text-purple-700 uppercase tracking-wider text-left">Email</th>
                  <th className="px-6 py-4 text-xs font-medium text-purple-700 uppercase tracking-wider text-left">Teléfono</th>
                  <th className="px-6 py-4 text-xs font-medium text-purple-700 uppercase tracking-wider text-left">Código Verificación</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.nombre} {u.apellido}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{u.telefono}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-800">{u.verificationCode || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default Usuarios;
