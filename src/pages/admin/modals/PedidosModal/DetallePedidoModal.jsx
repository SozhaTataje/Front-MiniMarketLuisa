import React from "react";
import { FiX, FiUser, FiMail, FiPhone, FiCalendar, FiPackage } from "react-icons/fi";

const DetallePedidoModal = ({ pedido, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-purple-700">
            Detalle del Pedido #{pedido.idpedido}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition">
            <FiX size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FiUser className="text-purple-500" />
              <span className="font-medium">{pedido.nombre} {pedido.apellido}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="text-blue-500" />
              <span>{pedido.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-green-500" />
              <span>{pedido.telefono}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-orange-500" />
              <span>{new Date(pedido.fecha).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <p className="font-semibold mt-4 mb-2">Productos del Pedido:</p>
            <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
              {pedido.pedidoProducto?.map((pp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{pp.productoSucursal?.producto?.nombre}</span>
                    <span className="text-xs text-gray-500">Sucursal: {pp.productoSucursal?.sucursal?.nombre}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">Cantidad: <span className="font-bold">{pp.cantidad}</span></p>
                    <p className="text-sm text-green-600">Subtotal: S/ {pp.subtotal?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePedidoModal;
