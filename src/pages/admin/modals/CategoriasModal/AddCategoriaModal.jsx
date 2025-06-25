import React from "react";
import { FiX, FiSave } from "react-icons/fi";
import { useForm } from "react-hook-form";
import api from "../../../../api/axiosInstance";
import toast from "react-hot-toast";

const AddCategoriaModal = ({ isOpen, onClose, onCreated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      await api.post("/categoria/save", data);
      toast.success("Categoría creada");
      onCreated();
      handleClose();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      toast.error("No se pudo crear la categoría");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-700">Nueva Categoría</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría
            </label>
            <input
              id="name"
              {...register("name", { required: "Este campo es obligatorio" })}
              type="text"
              placeholder="Ej. Lácteos, Abarrotes, Bebidas"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition ${
                isSubmitting
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              <FiSave />
              Guardar
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoriaModal;
