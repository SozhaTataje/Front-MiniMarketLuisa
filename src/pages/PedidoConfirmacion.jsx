import React from "react";
import { useParams, Link } from "react-router-dom";

const PedidoConfirmacion = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">
        ¡Pedido Confirmado!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Tu pedido con ID <strong>#{id}</strong> ha sido registrado con éxito.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Ir al inicio
      </Link>
    </div>
  );
};

export default PedidoConfirmacion;
