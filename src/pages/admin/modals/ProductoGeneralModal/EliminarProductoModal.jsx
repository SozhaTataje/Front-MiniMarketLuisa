import React from 'react';
import api from '../../../../api/axiosInstance';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const EliminarProductoModal = ({ isOpen, onClose, producto, onSuccess }) => {
  if (!isOpen || !producto) return null;

  const eliminarProducto = async () => {
    try {
      const response = await api.delete(`/producto/delete/${producto.idproducto}`);
      toast.success(response.data);
      onSuccess('Producto eliminado');
      onClose();
    } catch {
      toast.error('Error al eliminar producto');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">¿Eliminar Producto?</h2>
        <p className="mb-6 text-center">
          ¿Estás seguro que deseas eliminar el producto <strong>{producto.nombre}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={eliminarProducto}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarProductoModal;

