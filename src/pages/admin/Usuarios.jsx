import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import RegisterUserModal from "./modals/UsuariosModal/RegisterUserModal";
import {
  FiPlus, FiSearch, FiUsers, FiMail, FiPhone, FiX
} from "react-icons/fi";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/usuario/all");
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        alert("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter((u) =>
    `${u.nombre} ${u.email} ${u.telefono}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleUserAdded = () => setShowRegisterModal(false);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card label="Total Usuarios" value={usuarios.length} icon={<FiUsers />} color="blue" />
        <Card label="Usuarios Filtrados" value={filteredUsuarios.length} icon={<FiSearch />} color="green" />
        <Card label="Activos" value={usuarios.filter(u => u.email).length} icon={<FiMail />} color="purple" />
      </div>

      {/* Buscador */}
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

      {/* Tabla */}
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
                  <Th>Nombre Completo</Th>
                  <Th>Email</Th>
                  <Th>Teléfono</Th>
                  <Th>Código Verificación</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <Td className="font-medium text-gray-900">{u.nombre} {u.apellido}</Td>
                    <Td className="text-sm text-gray-700">{u.email}</Td>
                    <Td className="text-sm text-gray-700">{u.telefono}</Td>
                    <Td className="text-sm font-mono text-gray-800">{u.verificationCode || "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

// Subcomponentes reutilizables
const Card = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>
    </div>
  </div>
);

const Th = ({ children, center }) => (
  <th className={`px-6 py-4 text-xs font-medium text-purple-700 uppercase tracking-wider ${center ? "text-center" : "text-left"}`}>
    {children}
  </th>
);

const Td = ({ children, center }) => (
  <td className={`px-6 py-4 ${center ? "text-center" : ""}`}>{children}</td>
);

export default Usuarios;
