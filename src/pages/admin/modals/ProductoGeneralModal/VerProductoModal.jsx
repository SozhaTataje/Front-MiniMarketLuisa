import React from 'react';

const VerProductoModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in-up">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        {/* Título */}
        <h2 className="text-lg font-semibold mb-4 text-center">Detalles del Producto</h2>

        {/* Imagen */}
        <div className="w-full h-48 overflow-hidden rounded-md mb-4">
          <img
            src={producto.imagen || 'https://via.placeholder.com/400x240'}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Nombre:</strong> {producto.nombre}
          </p>
          <p>
            <strong>Descripción:</strong> {producto.descripcion || 'Sin descripción'}
          </p>
          <p>
            <strong>Precio:</strong> S/ {producto.precio?.toFixed(2) || '0.00'}
          </p>
          <p>
            <strong>Categoría:</strong> {producto.categoria?.name || 'Sin categoría'}
          </p>
          <p>
            <strong>Estado:</strong>{' '}
            {producto.estado ? (
              <span className="text-green-600 font-medium">Activo</span>
            ) : (
              <span className="text-red-600 font-medium">Inactivo</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerProductoModal;
