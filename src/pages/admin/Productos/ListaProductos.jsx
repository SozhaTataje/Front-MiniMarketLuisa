import React from 'react';
import { Eye, Edit, Trash2, MapPin } from 'lucide-react';

const ListaProductos = ({ productos, abrirModal }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Lista de Productos ({productos.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sucursales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map(producto => (
              <tr key={producto.idproducto} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={producto.imagen || '/api/placeholder/40/40'}
                      alt={producto.nombre}
                      className="w-10 h-10 rounded-lg object-cover mr-4 border"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{producto.descripcion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  S/ {producto.precio?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {producto.categoria?.name || 'Sin categoría'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-xs px-2 py-1 rounded-full ${producto.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {producto.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{producto.stockTotal || 0}</div>
                  {producto.stockReservado > 0 && (
                    <div className="text-xs text-orange-600">Reservado: {producto.stockReservado}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.totalSucursales || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex gap-2">
                    <button onClick={() => abrirModal('ver', producto)} className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => abrirModal('sucursales', producto)} className="text-green-600 hover:text-green-800 p-1.5 rounded-lg hover:bg-green-50">
                      <MapPin className="w-4 h-4" />
                    </button>
                    <button onClick={() => abrirModal('editar', producto)} className="text-yellow-600 hover:text-yellow-800 p-1.5 rounded-lg hover:bg-yellow-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => abrirModal('eliminar', producto)} className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaProductos;