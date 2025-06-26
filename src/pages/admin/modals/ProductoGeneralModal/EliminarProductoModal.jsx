import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Package, Shield, Clock } from 'lucide-react';
import api from '../../../../api/axiosInstance';
import toast from 'react-hot-toast';

const EliminarProductoModal = ({ isOpen, onClose, producto, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen || !producto) return null;

  const eliminarProducto = async () => {
    setLoading(true);
    const toastId = toast.loading('Eliminando producto...');

    try {
      const response = await api.delete(`/producto/delete/${producto.idproducto}`);
      
      // Mostrar el mensaje específico del backend
      const mensaje = response.data;
      
      if (mensaje.includes('✅')) {
        toast.success(mensaje.replace('✅ ', ''), { id: toastId });
      } else if (mensaje.includes('❌')) {
        toast.error(mensaje.replace('❌ ', ''), { id: toastId, duration: 5000 });
      } else {
        toast.success(mensaje, { id: toastId });
      }
      
      onSuccess && onSuccess('Operación completada');
      onClose();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      
      // Manejar diferentes tipos de error del backend
      const errorMessage = error.response?.data || 'Error al eliminar el producto';
      
      if (errorMessage.includes('pedidos activos')) {
        toast.error('No se puede eliminar: el producto tiene pedidos pendientes', { 
          id: toastId, 
          duration: 6000 
        });
      } else {
        toast.error(errorMessage.replace('❌ ', ''), { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  const getWarningInfo = () => {
    // Simulamos la lógica para mostrar advertencias
    return {
      type: 'warning',
      title: 'Advertencia de Eliminación',
      message: 'Esta acción puede ser irreversible dependiendo del estado del producto.',
      details: [
        'Si el producto no tiene pedidos asociados: se eliminará completamente',
        'Si tiene pedidos completados: se eliminará lógicamente (preservando historial)',
        'Si tiene pedidos activos: no se podrá eliminar hasta que se completen'
      ]
    };
  };

  const warningInfo = getWarningInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ease-out scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Eliminar Producto</h2>
              <p className="text-white/80 text-sm">Esta acción requiere confirmación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-2 transition-all duration-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Producto info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-4">
              {producto.imagen ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{producto.nombre}</h3>
                <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium text-blue-600">
                    S/ {producto.precio?.toFixed(2) || '0.00'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    producto.estado 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {producto.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning message */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-1">{warningInfo.title}</h4>
                <p className="text-sm text-amber-700 mb-3">{warningInfo.message}</p>
                
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium underline"
                >
                  {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
                
                {showDetails && (
                  <div className="mt-3 space-y-2">
                    {warningInfo.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-amber-700">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation question */}
          <div className="text-center mb-6">
            <p className="text-gray-700 font-medium">
              ¿Estás seguro que deseas eliminar este producto?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              El sistema determinará el tipo de eliminación según los pedidos asociados
            </p>
          </div>

          {/* Security features */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800 text-sm">Protecciones del Sistema</span>
            </div>
            <div className="space-y-1 text-xs text-blue-700">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Los pedidos activos bloquean la eliminación</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3" />
                <span>El historial de ventas se preserva automáticamente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={eliminarProducto}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarProductoModal;