import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../../../api/axiosInstance";

const EliminarPedidoModal = ({ pedido, onClose, onDeleted }) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async () => {
    try {
      await api.delete(`/pedido/delete/${pedido.idpedido}`);
      toast.success("Pedido eliminado correctamente");
      onDeleted(); 
      onClose();
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      setError("root", {
        message: "Error al eliminar el pedido. Intenta nuevamente.",
      });
      toast.error("No se pudo eliminar el pedido.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <FiTrash2 /> Eliminar Pedido
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="text-sm text-gray-700 space-y-4">
          <p>
            ¿Estás seguro de que deseas eliminar el pedido{" "}
            <strong className="text-purple-700">#{pedido.idpedido}</strong>?
          </p>
          <p>
            Esta acción es <span className="font-semibold text-red-600">irreversible</span> y no se puede recuperar.
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EliminarPedidoModal;
