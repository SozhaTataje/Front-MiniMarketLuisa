import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../../../api/axiosInstance";


const DeleteCategoriaModal = ({ isOpen, onClose, categoria, onDeleted }) => {
  if (!isOpen || !categoria) return null;

  const handleDelete = async () => {
    try {
      await api.delete("/categoria", { params: { idcategoria: categoria.id } });
      toast.success("Categoría eliminada");
      onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      toast.error("Error al eliminar la categoría");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Eliminar Categoría</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
            <FiX size={20} />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          ¿Seguro que deseas eliminar la categoría <strong>{categoria.name}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg">
            Cancelar
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2">
            <FiTrash2 /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoriaModal;