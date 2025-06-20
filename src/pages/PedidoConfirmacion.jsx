import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance"; // Asegúrate que lo uses

const PedidoConfirmacion = () => {
  const [pedido, setPedido] = useState(null); // <== ESTO ES NECESARIO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const idPedido = localStorage.getItem("ultimoPedido");

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await api.get(`/pedido/${idPedido}`);
        setPedido(res.data); // sin esto, lanzará el error que viste
      } catch (err) {
        console.error("Error al obtener el pedido:", err);
        setError("No se pudo cargar el pedido");
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">🎉 Pedido Confirmado</h2>
      <p className="text-center text-gray-600 mb-4">
        Pedido #{pedido.idpedido} ha sido registrado con éxito.
      </p>

      <div className="text-sm text-gray-700">
        <p><strong>Cliente:</strong> {pedido.nombre} {pedido.apellido}</p>
        <p><strong>Correo:</strong> {pedido.email}</p>
        <p><strong>Teléfono:</strong> {pedido.telefono}</p>
        <p><strong>Dirección:</strong> {pedido.direccion}</p>
        <p><strong>Fecha de pedido:</strong> {new Date(pedido.fechapedido).toLocaleString()}</p>
        <p><strong>Estado:</strong> {pedido.estado}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Productos</h3>
        <ul className="space-y-2">
          {pedido.pedidoProducto?.map((pp) => (
            <li key={pp.pedidoproductoid} className="p-3 border rounded bg-gray-50">
              <p>
                <strong>{pp.productoSucursal?.producto?.nombre || "Producto"}</strong> —{" "}
                Cantidad: {pp.cantidad} —{" "}
                Subtotal: S/ {pp.subtotal?.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PedidoConfirmacion;
