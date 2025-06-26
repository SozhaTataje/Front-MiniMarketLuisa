import React from "react";
import {
  Eye,
  MapPin,
  Edit,
  Trash2,
  Building2,
} from "lucide-react";

const ProductoCard = ({ producto, abrirModal }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img
          src={producto.imagen || 'https://via.placeholder.com/400x240/f3f4f6/9ca3af?text=Sin+Imagen'}
          alt={producto.nombre}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x240/f3f4f6/9ca3af?text=Sin+Imagen';
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {producto.nombre}
          </h3>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              producto.estado
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {producto.estado ? "Activo" : "Inactivo"}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">
            S/ {producto.precio?.toFixed(2)}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {producto.categoria?.name || "Sin categoría"}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="h-4 w-4 mr-1" />
            <span>{producto.totalSucursales} sucursales</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{producto.stockTotal}</span> stock total
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => abrirModal("ver", producto)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => abrirModal("sucursales", producto)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Gestionar sucursales"
            >
              <MapPin className="h-4 w-4" />
            </button>
            <button
              onClick={() => abrirModal("editar", producto)}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => abrirModal("eliminar", producto)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;
