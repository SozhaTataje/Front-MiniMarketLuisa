import React, { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
import api from "../../../../api/axiosInstance";

const ActualizarEstadoModal = ({
  pedido,
  onClose,
  cargarPedidos,
  ESTADOS,
  TRANSICIONES_VALIDAS,
}) => {
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [error, setError] = useState("");

  const actualizarEstado = async (idPedido, nuevoEstado) => {
    try {
      setActualizandoEstado(true);
      setError("");

      await api.put(`/pedido/update/${idPedido}`, {
        estado: nuevoEstado,
      });

      await cargarPedidos();
      onClose();
      alert(`Pedido actualizado exitosamente a: ${ESTADOS[nuevoEstado]?.label || nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      const mensaje = error.response?.data || error.message;
      setError("Error al actualizar el pedido: " + mensaje);
    } finally {
      setActualizandoEstado(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Actualizar Estado</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Estado actual:
            </label>
            <div className="px-3 py-2 rounded bg-gray-100 text-gray-700 text-sm">
              {ESTADOS[pedido.estado]?.label || pedido.estado}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Nuevo estado:
            </label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar estado...</option>
              {TRANSICIONES_VALIDAS[pedido.estado]?.map((estado) => (
                <option key={estado} value={estado}>
                  {ESTADOS[estado]?.label || estado}
                </option>
              ))}
            </select>
          </div>

          {nuevoEstado && ESTADOS[nuevoEstado]?.descripcion && (
            <div className="bg-purple-50 text-purple-800 text-sm p-3 rounded">
              <strong>Descripción:</strong> {ESTADOS[nuevoEstado].descripcion}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={actualizandoEstado}
          >
            Cancelar
          </button>
          <button
            onClick={() => actualizarEstado(pedido.idpedido, nuevoEstado)}
            disabled={!nuevoEstado || actualizandoEstado}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
          >
            {actualizandoEstado && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarEstadoModal;
