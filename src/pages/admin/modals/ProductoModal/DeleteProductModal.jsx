import React, { useState } from 'react';
import { FiTrash2, FiX, FiMapPin } from 'react-icons/fi';
import api from '../../../../api/axiosInstance';
import { toast } from 'react-hot-toast';

const DeleteProductModal = ({ isOpen, onClose, producto, onProductDeleted, sucursalName }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const eliminarSoloDeSucursal = async () => {
    const idProducto = producto?.producto?.idproducto;
    const idSucursal = producto?.sucursal?.idsucursal || producto?.idsucursal;

    if (!idProducto || !idSucursal) {
      setError('Error: faltan IDs');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await api.delete(`/productosucursal/eliminar?idProducto=${idProducto}&idSucursal=${idSucursal}`);
      toast.success('Producto eliminado de la sucursal');
      onProductDeleted(); 
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Error al eliminar de sucursal');
      toast.error('No se pudo eliminar de la sucursal');
    } finally {
      setIsDeleting(false);
    }
  };

  const eliminarCompletamente = async () => {
    const idProducto = producto?.producto?.idproducto;

    if (!idProducto) {
      setError('ID de producto inválido');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await api.delete(`/producto/delete/${idProducto}`);
      toast.success('Producto eliminado completamente');
      onProductDeleted(); 
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || 'Error al eliminar producto';
      setError(msg);

      if (err.response?.status === 400) {
        toast.error(`No se puede eliminar: ${msg}`);
      } else {
        toast.error('Error al eliminar producto');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <FiTrash2 /> Eliminar Producto
          </h2>
          <button onClick={onClose} disabled={isDeleting}>
            <FiX className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-gray-800">
            ¿Qué acción deseas realizar con <strong>{producto?.producto?.nombre}</strong>?
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

          <div className="space-y-2">
            <button
              onClick={eliminarSoloDeSucursal}
              disabled={isDeleting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
            >
              {isDeleting ? 'Eliminando de sucursal...' : `Eliminar de "${sucursalName}"`}
            </button>

            <button
              onClick={eliminarCompletamente}
              disabled={isDeleting}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
            >
              {isDeleting ? 'Eliminando del sistema...' : 'Eliminar del sistema'}
            </button>

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
