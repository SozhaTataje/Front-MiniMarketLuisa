import React from 'react';
import { X, Package, Tag, DollarSign, Eye } from 'lucide-react';

const VerProductoModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Eye className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Detalles del Producto</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 space-y-6">
          {/* Cabecera con imagen y nombre */}
          <div className="flex items-start space-x-4">
            <img
              src={producto.imagen || 'https://via.placeholder.com/150?text=Sin+Imagen'}
              alt={producto.nombre}
              className="w-24 h-24 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
              }}
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{producto.nombre}</h3>
              <div className="flex items-center mt-2 gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Tag className="h-4 w-4" /> {producto.categoria?.name || 'Sin categoría'}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  producto.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {producto.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Datos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Producto</label>
                <p className="text-lg font-mono text-gray-900">#{producto.idproducto}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                  <p className="text-2xl font-bold text-green-600">S/ {producto.precio?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-lg text-gray-900">{producto.categoria?.name || 'Sin categoría'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    producto.estado ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <p className="text-lg text-gray-900">
                    {producto.estado ? 'Producto Activo' : 'Producto Inactivo'}
                  </p>
                </div>
              </div>

              {producto.estadisticas && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Total Sistema</label>
                    <p className="text-lg font-semibold text-blue-600">
                      {producto.estadisticas.stockTotalSistema || 0} unidades
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sucursales</label>
                    <p className="text-lg font-semibold text-purple-600">
                      {producto.estadisticas.numeroSucursales || 0} sucursales
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 leading-relaxed">
                {producto.descripcion || 'Sin descripción disponible'}
              </p>
            </div>
          </div>

          {/* URL de imagen */}
          {producto.imagen && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen</label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <a
                  href={producto.imagen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {producto.imagen}
                </a>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Información Adicional</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">ID Categoría:</span>
                <span className="ml-2 text-blue-900">{producto.categoria?.id || 'N/A'}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Estado Booleano:</span>
                <span className="ml-2 text-blue-900">{producto.estado ? 'true' : 'false'}</span>
              </div>
            </div>
          </div>

          {/* Sucursales */}
          {Array.isArray(producto.sucursales) && producto.sucursales.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Disponible en Sucursales</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {producto.sucursales.map((sucursal, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{sucursal.nombreSucursal}</p>
                        <p className="text-sm text-gray-600">{sucursal.estado}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Stock: {sucursal.stock}</p>
                        <p className="text-xs text-gray-500">Reservado: {sucursal.stockReservado}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de cerrar */}
          <div className="flex justify-end pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
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
