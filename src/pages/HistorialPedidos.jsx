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
    const estilos = {
      PENDIENTE: "bg-yellow-500 text-white",
      PAGADO: "bg-blue-500 text-white",
      PREPARANDO: "bg-orange-500 text-white",
      LISTO_PARA_RECOGER: "bg-purple-500 text-white",
      ENTREGADO: "bg-green-500 text-white",
      CANCELADO: "bg-red-500 text-white"
    };
    return `px-3 py-1 text-xs font-bold rounded-full ${estilos[estado] || "bg-gray-500 text-white"}`;
  };

  if (loading)
    return <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-purple-600 font-semibold">Cargando pedidos...</p>
      </div>
    </div>;

  if (error)
    return <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
      <p className="text-red-600 font-semibold bg-white p-6 rounded-xl shadow-lg">{error}</p>
    </div>;

  if (pedidos.length === 0)
    return <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
      <p className="text-gray-600 font-semibold bg-white p-6 rounded-xl shadow-lg">No tienes pedidos registrados.</p>
    </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
          Historial de Pedidos
        </h1>
        
        <div className="space-y-4">
          {pedidos.map((p) => {
            const abierto = expandido === p.idpedido;
            const toggle = () => setExpandido(abierto ? null : p.idpedido);

            return (
              <div key={p.idpedido} className="bg-white/90 backdrop-blur rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-between items-center p-6 cursor-pointer hover:bg-purple-50" onClick={toggle}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CalendarClock className="w-5 h-5 text-purple-500" />
                      <p className="font-bold text-gray-800">Pedido #{p.idpedido}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {p.fechapedido ? new Date(p.fechapedido).toLocaleString() : "Sin fecha"}
                    </p>
                    <span className={estadoBadge(p.estado)}>{p.estado || "Sin estado"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        S/ {p.pedidoProducto?.reduce((s, pp) => s + (pp.subtotal || 0), 0).toFixed(2)}
                      </p>
                    </div>
                    {abierto ? <ChevronUp className="w-5 h-5 text-purple-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {abierto && (
                  <div className="px-6 pb-6 space-y-4 border-t border-purple-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                      <p className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"><MapPin className="w-4 h-4 text-blue-500" /> {p.direccion || "No especificada"}</p>
                      <p className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"><Phone className="w-4 h-4 text-green-500" /> {p.telefono || "Sin número"}</p>
                      <p className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg"><Mail className="w-4 h-4 text-purple-500" /> {p.email || "Sin correo"}</p>
                      {p.fechapago && (
                        <p className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                          <CreditCard className="w-4 h-4 text-orange-500" />
                          {new Date(p.fechapago).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4">
                      <h3 className="font-bold flex items-center gap-2 text-gray-800 mb-3">
                        <ShoppingBasket className="w-5 h-5 text-purple-600" /> Productos
                      </h3>
                      <ul className="space-y-3">
                        {p.pedidoProducto?.map((pp) => (
                          <li key={pp.pedidoproductoid} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-800">{pp.productoSucursal?.producto?.nombre || "Producto"}</p>
                                <p className="text-sm text-gray-600">Cantidad: {pp.cantidad} u.</p>
                                {pp.productoSucursal?.sucursal?.nombre && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <Store className="w-3 h-3" /> {pp.productoSucursal.sucursal.nombre}
                                  </p>
                                )}
                              </div>
                              <span className="text-xl font-bold text-green-600">S/ {pp.subtotal?.toFixed(2) || "0.00"}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 text-right">
                      <span className="text-2xl font-bold text-green-600">
                        Total: S/ {p.pedidoProducto?.reduce((s, pp) => s + (pp.subtotal || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistorialPedidos;