import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import RegisterUserModal from "./modals/RegisterUserModal";
import EditUserModal from "./modals/EditUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiUsers, FiMail, FiPhone } from "react-icons/fi";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/usuario/all");
      console.log("Usuarios recibidos:", res.data);
      setUsuarios(res.data);
      setFilteredUsuarios(res.data);
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

    useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter(
        (usuario) =>
          usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.telefono?.includes(searchTerm)
      );
      setFilteredUsuarios(filtered);
    }
  }, [searchTerm, usuarios]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUserUpdated = () => {
    fetchUsuarios();
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleUserDeleted = () => {
    fetchUsuarios();
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleUserAdded = () => {
    fetchUsuarios();
    setShowRegisterModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-full">
            <FiUsers className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-purple-700">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600">
              Administra los usuarios del sistema
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <FiPlus className="text-lg" />
          Nuevo Usuario
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Filtrados</p>
              <p className="text-2xl font-bold text-gray-800">{filteredUsuarios.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiSearch className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Activos</p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.filter(u => u.email).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiMail className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex items-center gap-3">
          <FiSearch className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Cargando usuarios...</span>
            </div>
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-purple-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((usuario, index) => (
                  <tr
                    key={usuario.idusuario || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {usuario.idusuario}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {usuario.nombre?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {usuario.nombre || "Sin nombre"}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FiMail size={12} />
                            {usuario.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <FiPhone size={12} />
                        {usuario.telefono || "No especificado"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditUser(usuario)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar usuario"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usuario)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar usuario"
                        >
                          <FiTrash2 size={16} />
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

      {/* Modales */}
      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onUserAdded={handleUserAdded}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
};

export default Usuarios;