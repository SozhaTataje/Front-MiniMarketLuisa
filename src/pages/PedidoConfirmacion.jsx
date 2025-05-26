import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { FiCheckCircle } from "react-icons/fi";
import { CartContext } from "../context/CartContext";

const PedidoConfirmacion = () => {
  const { id } = useParams();
  const [setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const { vaciarCarrito } = useContext(CartContext);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await api.get(`/pedido/${id}`);
        setPedido(res.data);

        console.log("Estado del pedido:", res.data.estado);
        if (res.data?.estado === "COMPLETADO") {
          vaciarCarrito();
          localStorage.removeItem("carrito");
        }
      } catch (error) {
        console.error("Error al obtener el pedido:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id, vaciarCarrito]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">Cargando pedido...</div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <FiCheckCircle className="text-green-500" size={80} />
      <h1 className="text-3xl font-bold text-green-700 mt-4">
        ¡Gracias por su compra!
      </h1>
      <p className="text-gray-700 mt-2">Su pedido ha sido registrado exitosamente.</p>
      <p className="text-gray-500">Le notificaremos cuando esté en camino.</p>
    </div>
  );
};

export default PedidoConfirmacion;
