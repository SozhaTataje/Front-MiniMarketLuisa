import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axiosInstance";

const PedidoConfirmacion = () => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const idPedido = searchParams.get("id") || localStorage.getItem("ultimoPedido");

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await api.get(`/pedido/pedido`, {
          params: { idpedido: idPedido },
        });
        setPedido(res.data);
      } catch (err) {
        console.error("Error al obtener el pedido:", err);
        setError("No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };

    if (idPedido) {
      fetchPedido();
    } else {
      setError("No se encontró el ID del pedido.");
      setLoading(false);
    }
  }, [idPedido]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-10 mb-10">
      <h2 className="text-3xl font-bold text-purple-700 mb-4 text-center">
        ¡Pedido Confirmado!
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Pedido #{pedido.idpedido} ha sido registrado con éxito.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
        <p><strong>Cliente:</strong> {pedido.nombre} {pedido.apellido}</p>
        <p><strong>Correo:</strong> {pedido.email}</p>
        <p><strong>Teléfono:</strong> {pedido.telefono}</p>
        <p><strong>Dirección:</strong> {pedido.direccion}</p>
        <p><strong>Fecha de pedido:</strong> {new Date(pedido.fechapedido).toLocaleString()}</p>
        <p><strong>Estado:</strong> {pedido.estado}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Productos del pedido</h3>
        <ul className="space-y-2">
          {pedido.pedidoProducto?.map((pp) => (
            <li
              key={pp.pedidoproductoid}
              className="p-4 border border-gray-200 rounded bg-gray-50 shadow-sm"
            >
              <p className="font-medium">
                <strong>{pp.productoSucursal?.producto?.nombre || "Producto"}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Cantidad: {pp.cantidad} — Subtotal: <strong>S/ {pp.subtotal?.toFixed(2)}</strong>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-8">
        <a
          href="/productos"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Seguir comprando
        </a>
      </div>
    </div>
  );
};

export default PedidoConfirmacion;
