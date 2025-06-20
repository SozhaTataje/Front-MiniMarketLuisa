import React, { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
import api from "../../../../api/axiosInstance";

const DeleteProductModal = ({ isOpen, onClose, producto, onProductDeleted, sucursalName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !producto) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const idproducto = producto.producto?.idproducto || producto.idproducto;
      const idsucursal = producto.idsucursal || producto.sucursal?.idsucursal;

      const response = await api.delete(`/productosucursal/eliminar`, {
        params: { idproducto, idsucursal }
      });

      if (response.status === 200) {
        alert("✅ Producto eliminado correctamente de la sucursal.");
        onProductDeleted(); // recarga
        onClose();          // cierra modal
      } else {
        setError("Error inesperado. Código: " + response.status);
      }
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      if (err.response?.status === 403) {
        setError("🚫 No tienes permisos para eliminar este producto.");
      } else {
        setError("❌ Ocurrió un error al eliminar el producto.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-red-600">Eliminar Producto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Mensaje */}
        <p className="text-gray-700 mb-4">
          ¿Estás seguro de que deseas eliminar el producto{" "}
          <strong>{producto?.producto?.nombre || producto?.nombre}</strong> de la sucursal{" "}
          <strong>{sucursalName}</strong>?
        </p>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
