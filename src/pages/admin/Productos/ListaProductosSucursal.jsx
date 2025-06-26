// ListaProductosSucursal.jsx
import React from 'react';
import { Store, AlertCircle, Package } from 'lucide-react';

const ListaProductosSucursal = ({ productos }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Productos por Sucursal ({productos.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sucursal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Disponible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Reservado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((item) => (
              <tr key={item.idProductoSucursal} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Store className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.sucursal?.nombre}</div>
                      <div className="text-sm text-gray-500">{item.sucursal?.ciudad}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={item.producto?.imagen || '/api/placeholder/32/32'}
                      alt={item.producto?.nombre}
                      className="w-8 h-8 rounded-lg object-cover mr-3 border"
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {item.producto?.nombre}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-semibold text-gray-900">{item.stock || 0}</div>
                    {(item.stock || 0) < 10 && (
                      <div className="ml-2 p-1 bg-yellow-100 rounded-full">
                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-orange-600 font-medium">{item.stockReservado || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaProductosSucursal;
