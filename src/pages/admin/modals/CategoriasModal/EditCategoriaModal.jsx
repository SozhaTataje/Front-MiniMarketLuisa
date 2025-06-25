import React, { useEffect, useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import api from "../../../../api/axiosInstance";
import toast from "react-hot-toast";

const EditCategoriaModal = ({ isOpen, onClose, categoria, onUpdated }) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoria) {
      setName(categoria.name || "");
    }
  }, [categoria]);

  if (!isOpen || !categoria) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.put(`/categoria/update/${categoria.id}`, { name }); // ← USAMOS categoria.id

      toast.success("Categoría actualizada exitosamente");
      onUpdated();
      handleClose();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data || "Error desconocido"}`);
      } else if (error.request) {
        toast.error("No se pudo conectar con el servidor");
      } else {
        toast.error("Error al configurar la solicitud");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-700">Editar Categoría</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Cerrar modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Lácteos, Abarrotes, Bebidas..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={`flex-1 px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition ${
                isSubmitting || !name.trim()
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              <FiSave />
              {isSubmitting ? "Actualizando..." : "Actualizar"}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoriaModal;
