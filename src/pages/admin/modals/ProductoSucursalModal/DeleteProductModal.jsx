import React, { useState } from 'react';
import { FiTrash2, FiX, FiMapPin } from 'react-icons/fi';
import api from '../../../../api/axiosInstance';
import { toast } from 'react-hot-toast';

const DeleteProductModal = ({ isOpen, onClose, producto, onProductDeleted, sucursalName }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const eliminarSoloDeSucursal = async () => {
    const idProducto = producto?.producto?.idproducto || producto?.idproducto;
    const idSucursal = producto?.sucursal?.idsucursal || producto?.idsucursal;

    if (!idProducto || !idSucursal) {
      const mensaje = 'Faltan datos necesarios para eliminar';
      setError(mensaje);
      toast.error(mensaje);
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const res = await api.delete(`/productosucursal/eliminar/${idProducto}/${idSucursal}`);
      
      if (res.status === 200) {
        toast.success('Producto eliminado de la sucursal');
        onProductDeleted();
        onClose();
      } else {
        throw new Error('Error inesperado');
      }

    } catch (err) {
      const mensaje = err.response?.data || 'No se pudo eliminar el producto de la sucursal';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <FiTrash2 /> Eliminar Producto
          </h2>
          <button onClick={onClose} disabled={isDeleting}>
            <FiX className="text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-4">
          <p className="text-gray-800">
            ¿Qué acción deseas realizar con <strong>{producto?.producto?.nombre || producto?.nombre}</strong>?
          </p>

          {sucursalName && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <FiMapPin className="text-gray-400" />
              <span>{sucursalName}</span>
            </div>
          )}

          {error && (
            <div className="text-red-600 bg-red-100 rounded-lg p-2 text-sm">
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-2">
            {sucursalName && (
              <button
                onClick={eliminarSoloDeSucursal}
                disabled={isDeleting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
              >
                {isDeleting ? 'Eliminando de sucursal...' : `Eliminar de "${sucursalName}"`}
              </button>
            )}

            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;