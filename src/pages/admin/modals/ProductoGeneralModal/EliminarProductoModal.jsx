import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import api from "../../../../api/axiosInstance";
import { toast } from 'react-hot-toast';

const EliminarProductoModal = ({ isOpen, onClose, producto, onProductoEliminado }) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  const handleEliminar = async () => {
    if (confirmText.toLowerCase() !== 'eliminar') {
      toast.error('Debe escribir "eliminar" para confirmar');
      return;
    }

    if (!producto || !producto.idproducto) {
      toast.error('Producto no válido');
      return;
    }

    setLoading(true);

    try {
      await api.delete(`/producto/delete/${producto.idproducto}`);
      toast.success('Producto eliminado exitosamente');
      onProductoEliminado(); // actualiza lista en padre
      handleClose();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      toast.error('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Eliminar Producto</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" disabled={loading}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">¡Atención! Esta acción no se puede deshacer</h3>
                <p className="text-sm text-red-700">
                  Al eliminar este producto, se marcará como inactivo y eliminado en el sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center space-x-3">
            <img
              src={producto.imagen || 'https://via.placeholder.com/150?text=Sin+Imagen'}
              alt={producto.nombre}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
              }}
            />
            <div>
              <h4 className="font-semibold text-gray-900">{producto.nombre}</h4>
              <p className="text-sm text-gray-600">{producto.categoria?.name}</p>
              <p className="text-sm font-medium text-green-600">S/ {producto.precio?.toFixed(2)}</p>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Para confirmar, escriba <span className="font-semibold text-red-600">"eliminar"</span>:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Escriba 'eliminar'"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 mb-6"
            disabled={loading}
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEliminar}
              disabled={loading || confirmText.toLowerCase() !== 'eliminar'}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm flex items-center hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Producto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarProductoModal;
