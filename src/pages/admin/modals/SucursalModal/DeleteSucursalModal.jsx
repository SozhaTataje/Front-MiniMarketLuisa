import React, { useState } from "react";
import Modal from "react-modal";
import api from "../../../../api/axiosInstance";
import { FiAlertTriangle } from "react-icons/fi";

const DeleteSucursalModal = ({ isOpen, onClose, onDeleted, sucursal }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!sucursal) return;

    setLoading(true);
    try {
      await api.delete("/sucursal/delete", {
        params: { idSucursal: sucursal.idsucursal }
      });
      
      alert("Sucursal eliminada correctamente.");
      onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar sucursal:", error);
      const errorMessage = error.response?.data || error.message || "Error desconocido";
      alert("Error al eliminar sucursal: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!sucursal) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FiAlertTriangle className="text-red-500" size={64} />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Confirmar Eliminación
        </h2>
        
        <p className="text-gray-600 mb-2">
          ¿Estás seguro de que deseas eliminar la sucursal:
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="font-semibold text-lg text-gray-800">
            {sucursal.nombre}
          </p>
          <p className="text-gray-600 text-sm">
            {sucursal.direccion}
          </p>
          <p className="text-gray-500 text-sm">
            {sucursal.ciudad}
          </p>
        </div>
        
        <p className="text-red-600 text-sm mb-6 font-medium">
          ⚠️ Esta acción no se puede deshacer
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        
        <button
          onClick={handleDelete}
          className={`px-6 py-2 rounded-md font-semibold text-white transition-colors ${
            loading 
              ? "bg-red-400 cursor-not-allowed" 
              : "bg-red-600 hover:bg-red-700"
          }`}
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteSucursalModal;