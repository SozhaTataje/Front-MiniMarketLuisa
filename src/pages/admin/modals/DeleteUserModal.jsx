import React, { useState } from "react";
import Modal from "react-modal";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const DeleteUserModal = ({ isOpen, onClose, user, onUserDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?.idusuario) {
      alert("Error: No se encontró el ID del usuario");
      return;
    }

    setLoading(true);
    try {
      // Como el backend no tiene endpoint de delete, simularemos la funcionalidad
      // En un caso real, necesitarías agregar el endpoint en el backend
      alert("Funcionalidad de eliminación pendiente de implementar en el backend");
      onUserDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="text-red-500" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            Confirmar Eliminación
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <FiX size={24} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          ¿Estás seguro de que deseas eliminar este usuario?
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="font-semibold text-gray-800">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="text-gray-600 text-sm">
            {user?.email}
          </p>
          <p className="text-gray-600 text-sm">
            Tel: {user?.telefono}
          </p>
        </div>

        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            <strong>¡Advertencia!</strong> Esta acción no se puede deshacer. 
            El usuario será eliminado permanentemente del sistema.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          className={`flex-1 py-3 px-4 rounded-md font-semibold text-white transition-colors ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar Usuario"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;