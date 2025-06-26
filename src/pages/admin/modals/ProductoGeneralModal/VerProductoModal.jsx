import React from 'react';
import {
  X, Package, Tag, DollarSign, FileText,
  CheckCircle, XCircle, MapPin
} from 'lucide-react';

const VerProductoModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 ease-out scale-100">

        {/* Header con imagen de fondo */}
        <div className="relative h-64 overflow-hidden">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Package className="h-20 w-20 text-gray-400" />
            </div>
          )}

          {/* Overlay horizontal de izquierda a derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Badge de estado */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ${
              producto.estado
                ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                : 'bg-red-500/20 text-red-100 border border-red-400/30'
            }`}>
              {producto.estado ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Activo
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Inactivo
                </>
              )}
            </span>
          </div>

          {/* Info del producto y sucursal */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                {producto.nombre}
              </h2>
              <p className="text-white/80 text-sm">
                {producto.categoria?.name || 'Sin categoría'}
              </p>
            </div>

            {/* Badge sucursal */}
            {producto.sucursal?.nombre && (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-2 border border-white/20">
                <MapPin className="h-4 w-4" />
                {producto.sucursal.nombre}
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Precio destacado */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-blue-50 rounded-2xl px-6 py-3">
              <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-3xl font-bold text-blue-600">
                S/ {producto.precio?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-200 rounded-lg p-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Descripción</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {producto.descripcion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info adicional */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="bg-green-200 rounded-lg p-2 w-fit mx-auto mb-2">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">ID Producto</h4>
              <p className="text-green-600 font-bold">#{producto.idproducto}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="bg-orange-200 rounded-lg p-2 w-fit mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Estado</h4>
              <p className={`font-bold ${producto.estado ? 'text-green-600' : 'text-red-600'}`}>
                {producto.estado ? 'Disponible' : 'No disponible'}
              </p>
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerProductoModal;
