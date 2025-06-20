// src/pages/modals/PedidosModal/EliminarPedidoModal.jsx
import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";

const EliminarPedidoModal = ({ pedido, onClose, onDeleted }) => {
  const eliminarPedido = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3600/pedido/delete/${pedido.idpedido}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDeleted(); // actualiza lista en la tabla
        alert("Pedido eliminado correctamente.");
      } else {
        const error = await response.text();
        alert("Error al eliminar: " + error);
      }
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      alert("Error inesperado al intentar eliminar el pedido.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative">
        {/* Encabezado */}
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

        {/* Mensaje */}
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            ¿Estás seguro de que deseas eliminar el pedido{" "}
            <strong className="text-purple-700">#{pedido.idpedido}</strong>?
          </p>
          <p>
            Esta acción es <span className="font-semibold text-red-600">irreversible</span> y no se puede recuperar.
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={eliminarPedido}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarPedidoModal;
