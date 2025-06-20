import React, { useEffect, useState } from "react";
import axios from "axios";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`http://localhost:3600/pedido/${userEmail}`);
        setPedidos(response.data); // Ya vienen filtrados desde el backend
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("Error al cargar pedidos");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchPedidos();
    } else {
      setLoading(false);
      setError("No se ha encontrado el email del usuario.");
    }
  }, [userEmail]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-blue-600">Cargando pedidos...</p>
    );

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (pedidos.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        No tienes pedidos registrados.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Historial de Pedidos
      </h2>

      <div className="space-y-6">
        {pedidos.map((pedido) => (
          <div
            key={pedido.idpedido}
            className="border p-6 rounded-lg bg-white shadow-lg"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Pedido #{pedido.idpedido} |{" "}
                {pedido.fechapedido
                  ? new Date(pedido.fechapedido).toLocaleString()
                  : "Sin fecha"}
              </p>
              <p className="text-sm text-gray-700 font-semibold">
                Estado:{" "}
                <span className="uppercase">
                  {pedido.estado || "No definido"}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Dirección: {pedido.direccion || "No especificada"}
              </p>
              <p className="text-sm text-gray-700">
                Teléfono: {pedido.telefono || "Sin número"}
              </p>
              <p className="text-sm text-gray-700">
                Correo: {pedido.email || "Sin correo"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Productos:</h3>
              <ul className="space-y-2">
                {pedido.pedidoProducto?.map((pp) => (
                  <li
                    key={pp.pedidoproductoid}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">
                        {pp.productoSucursal?.producto?.nombre || "Producto"}
                      </span>{" "}
                      — Cantidad: {pp.cantidad} — Subtotal:{" "}
                      <span className="font-semibold text-green-600">
                        S/ {pp.subtotal?.toFixed(2) || "0.00"}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialPedidos;
