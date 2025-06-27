import React from 'react';
import {
  X, Package, Tag, DollarSign, FileText,
  CheckCircle, XCircle, MapPin
} from 'lucide-react';

const VerProductoModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl overflow-hidden">
        
        <div className="flex">
          <div className="flex-1 p-6 space-y-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-gray-800 mb-1">
                {producto.nombre}
              </h2>
              <p className="text-gray-500 text-sm">
                {producto.categoria?.name || 'Sin categoría'}
              </p>
            </div>

            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
                producto.estado
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {producto.estado ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Activo
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Inactivo
                  </>
                )}
              </span>
            </div>

           <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-2xl font-semibold text-purple-700">
                  S/ {producto.precio?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
            {producto.sucursal?.nombre && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{producto.sucursal.nombre}</span>
              </div>
            )}
            {producto.descripcion && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 text-sm">Descripción</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <Package className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">ID Producto</p>
                <p className="text-purple-600 font-medium">#{producto.idproducto}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <CheckCircle className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Estado</p>
                <p className={`font-medium text-sm ${producto.estado ? 'text-purple-600' : 'text-gray-500'}`}>
                  {producto.estado ? 'Disponible' : 'No disponible'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Cerrar
            </button>
          </div>

          <div className="w-80 h-96">
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover rounded-r-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-50 rounded-r-2xl">
                <Package className="h-20 w-20 text-purple-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerProductoModal;