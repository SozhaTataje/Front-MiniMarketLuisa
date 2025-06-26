import React from "react";
import Modal from "react-modal";
import {FiX, FiMapPin, FiPackage, FiDollarSign, FiInfo, FiTag} from "react-icons/fi";

const getPlaceholderImage = () => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#9ca3af" text-anchor="middle" dy=".3em">
        Sin imagen
      </text>
    </svg>
  `)}`;
};

const ProductDetailModal = ({ isOpen, onClose, producto, categorias, sucursalName }) => {
  if (!producto || !producto.producto) return null;

  const prod = producto.producto;

  const getCategoriaName = (idCategoria) => {
    const categoria = categorias.find((c) => c.id === idCategoria);
    return categoria ? categoria.name : "Sin categoría";
  };

  const getEstadoDisplay = (estado) => (estado ? "Activo" : "Inactivo");

  const getEstadoColor = (estado) =>
    estado ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { text: "Sin stock", color: "text-red-600 bg-red-100" };
    if (stock < 10)
      return { text: "Stock bajo", color: "text-yellow-600 bg-yellow-100" };
    return { text: "Stock disponible", color: "text-green-600 bg-green-100" };
  };

  const stockStatus = getStockStatus(producto.stock);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
      className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[95vh] overflow-auto"
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiInfo className="text-purple-600" />
          Detalles del Producto
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={prod.imagen || getPlaceholderImage()}
                alt={prod.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = getPlaceholderImage();
                }}
              />
            </div>

            {/* Estado */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
                    prod.estado
                  )}`}
                >
                  {getEstadoDisplay(prod.estado)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Estado</p>
              </div>
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}
                >
                  {stockStatus.text}
                </div>
                <p className="text-xs text-gray-500 mt-1">Disponibilidad</p>
              </div>
            </div>
          </div>

          {/* Info producto */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {prod.nombre}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {prod.descripcion || "Sin descripción disponible"}
              </p>
            </div>

            <div className="space-y-4">
              {/* Precio */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FiDollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Precio</p>
                  <p className="text-xl font-bold text-green-600">
                    S/ {prod.precio?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FiPackage className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Stock en sucursal</p>
                  <p className="text-xl font-bold text-blue-600">
                    {producto.stock} unidades
                  </p>
                </div>
              </div>

              {/* Categoría */}
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <FiTag className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Categoría</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {getCategoriaName(prod.categoria?.id)}
                  </p>
                </div>
              </div>

              {/* Sucursal */}
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <FiMapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Sucursal</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {sucursalName || "Sucursal no disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información*/}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Información técnica
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">ID Producto</p>
              <p className="font-mono text-gray-900">{prod.idproducto}</p>
            </div>
            <div>
              <p className="text-gray-500">ID Producto-Sucursal</p>
              <p className="font-mono text-gray-900">
                {producto.idProductoSucursal}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Stock Reservado</p>
              <p className="font-mono text-gray-900">
                {producto.stockReservado || 0} unidades
              </p>
            </div>
          </div>
        </div>

        {/* Botón */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
