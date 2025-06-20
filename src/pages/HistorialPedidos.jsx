import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import {
  MapPin, Phone, Mail, CreditCard, ShoppingBasket,
  Store, CalendarClock, ChevronDown, ChevronUp
} from "lucide-react";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandido, setExpandido] = useState(null);

  const getUserEmailFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const email = getUserEmailFromToken();
      if (!email) {
        setError("Usuario no identificado");
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get(`/pedido/${email}`);
        setPedidos(data);
      } catch {
        setError("Error al cargar pedidos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const estadoBadge = (estado) => {
    const base = "px-2 py-1 text-xs font-semibold rounded-full";
    const estilos = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      PAGADO: "bg-blue-100 text-blue-800",
      PREPARANDO: "bg-orange-100 text-orange-800",
      LISTO_PARA_RECOGER: "bg-purple-100 text-purple-800",
      ENTREGADO: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800"
    };
    return `${base} ${estilos[estado] || "bg-gray-100 text-gray-800"}`;
  };

  if (loading)
    return <p className="text-center mt-10 text-blue-600 animate-pulse">Cargando pedidos...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (pedidos.length === 0)
    return <p className="text-center mt-10 text-gray-600">No tienes pedidos registrados.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">Historial de Pedidos</h1>
      <div className="space-y-5">
        {pedidos.map((p) => {
          const abierto = expandido === p.idpedido;
          const toggle = () => setExpandido(abierto ? null : p.idpedido);

          return (
            <div
              key={p.idpedido}
              className="bg-white border rounded-xl shadow-md overflow-hidden transition"
            >
 
              <div
                className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50"
                onClick={toggle}
              >
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-purple-500" />
                    Pedido #{p.idpedido} ·{" "}
                    {p.fechapedido
                      ? new Date(p.fechapedido).toLocaleString()
                      : "Sin fecha"}
                  </p>
                  <span className={estadoBadge(p.estado)}>{p.estado || "Sin estado"}</span>
                </div>
                {abierto ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>


              {abierto && (
                <div className="px-6 pb-6 text-sm text-gray-700 space-y-4">
          
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {p.direccion || "No especificada"}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {p.telefono || "Sin número"}</p>
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {p.email || "Sin correo"}</p>
                    {p.fechapago && (
                      <p className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {new Date(p.fechapago).toLocaleString()}
                      </p>
                    )}
                  </div>

                    <div>
                    <h3 className="font-semibold flex items-center gap-2 text-gray-800 mb-2">
                      <ShoppingBasket className="w-5 h-5 text-purple-600" /> Productos
                    </h3>
                    <ul className="space-y-2">
                      {p.pedidoProducto?.map((pp) => (
                        <li
                          key={pp.pedidoproductoid}
                          className="bg-purple-50 shadow-sm rounded-lg p-4 transition hover:bg-purple-100"
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-800">
                              {pp.productoSucursal?.producto?.nombre || "Producto"}
                            </p>
                            <span className="text-green-600 font-semibold">
                              S/ {pp.subtotal?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Cantidad: {pp.cantidad} u.
                          </p>
                          {pp.productoSucursal?.sucursal?.nombre && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Store className="w-3 h-3" /> {pp.productoSucursal.sucursal.nombre}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                            <div className="pt-3 text-right font-bold text-lg text-gray-800 border-t">
                    Total:{" "}
                    <span className="text-green-600">
                      S/ {p.pedidoProducto?.reduce((s, pp) => s + (pp.subtotal || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistorialPedidos;
