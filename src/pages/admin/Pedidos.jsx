import React, { useState, useEffect } from "react";
import {FiInfo, FiEdit, FiTrash2, FiRefreshCw} from "react-icons/fi";
import {Clock, CreditCard, ChefHat, CheckCircle, Truck, XCircle} from "lucide-react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api/axiosInstance"; 
import DetallePedidoModal from "./modals/PedidosModal/DetallePedidoModal";
import EliminarPedidoModal from "./modals/PedidosModal/EliminarPedidoModal";
import ActualizarEstadoModal from "./modals/PedidosModal/ActualizarEstadoModal";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 10;

  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  const { register, watch } = useForm();
  const searchTerm = watch("search") || "";
  const filterSucursal = watch("sucursal") || "";
  const filterEstado = watch("estado") || "";

  const ESTADOS = {
    PENDIENTE: { label: "Pendiente", icon: Clock, color: "text-yellow-600 bg-yellow-100", descripcion: "Esperando pago del cliente" },
    PAGADO: { label: "Pagado", icon: CreditCard, color: "text-blue-600 bg-blue-100", descripcion: "Pago procesado automáticamente" },
    PREPARANDO: { label: "Preparando", icon: ChefHat, color: "text-orange-600 bg-orange-100", descripcion: "Pedido en preparación" },
    LISTO_PARA_RECOGER: { label: "Listo para recoger", icon: CheckCircle, color: "text-purple-600 bg-purple-100", descripcion: "Listo para entrega" },
    ENTREGADO: { label: "Entregado", icon: Truck, color: "text-green-600 bg-green-100", descripcion: "Pedido entregado" },
    CANCELADO: { label: "Cancelado", icon: XCircle, color: "text-red-600 bg-red-100", descripcion: "Pedido cancelado" },
  };

  const TRANSICIONES_VALIDAS = {
    PENDIENTE: ["CANCELADO"],
    PAGADO: ["PREPARANDO", "CANCELADO"],
    PREPARANDO: ["LISTO_PARA_RECOGER"],
    LISTO_PARA_RECOGER: ["ENTREGADO"],
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/pedido/all");
      setPedidos(data);
      toast.success("Pedidos cargados correctamente");
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const getSucursal = (pedido) =>
    pedido.pedidoProducto?.[0]?.productoSucursal?.sucursal?.nombre || "-";

  const calcularTotal = (pedido) =>
    pedido.pedidoProducto?.reduce((sum, p) => sum + p.subtotal, 0) || 0;

  const getEstadoColor = (estado) =>
    ESTADOS[estado]?.color || "bg-gray-100 text-gray-800";

  const abrirDetalle = (pedido) => {
    setSelectedPedido(pedido);
    setShowDetailModal(true);
  };

  const abrirEliminar = (pedido) => {
    setSelectedPedido(pedido);
    setShowDeleteModal(true);
  };

  const abrirActualizarEstado = (pedido) => {
    setSelectedPedido(pedido);
    setShowEstadoModal(true);
  };

  const filteredPedidos = pedidos.filter((p) => {
    const matchTerm =
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idpedido.toString().includes(searchTerm);

    const matchSucursal =
      filterSucursal === "" || p.pedidoProducto?.some(pp =>
        pp.productoSucursal?.sucursal?.nombre === filterSucursal
      );

    const matchEstado = filterEstado === "" || p.estado === filterEstado;

    return matchTerm && matchSucursal && matchEstado;
  });

  const totalPaginas = Math.ceil(filteredPedidos.length / pedidosPorPagina);
  const pedidosPaginados = filteredPedidos.slice(
    (paginaActual - 1) * pedidosPorPagina,
    paginaActual * pedidosPorPagina
  );

  const contarPorEstado = (estado) =>
    pedidos.filter((p) => p.estado === estado).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">Administra todos los pedidos registrados</p>
        </div>
        <button
          onClick={fetchPedidos}
          className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 border shadow-md"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 mb-8">
        {Object.entries(ESTADOS).map(([estadoKey, config]) => {
          const Icon = config.icon;
          return (
            <div key={estadoKey} className={`p-4 rounded-lg shadow border ${config.color}`}>
              <div className="flex items-center justify-between">
                <Icon className="w-6 h-6" />
                <span className="text-sm font-semibold">{config.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{contarPorEstado(estadoKey)}</p>
            </div>
          );
        })}
      </div>

      <form className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por cliente o ID"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
          {...register("search")}
        />
        <select
          className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
          {...register("sucursal")}
        >
          <option value="">Todas las Sucursales</option>
          {[...new Set(
            pedidos.flatMap(p =>
              p.pedidoProducto.map(pp => pp.productoSucursal?.sucursal?.nombre)
            )
          )].filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
          {...register("estado")}
        >
          <option value="">Todos los Estados</option>
          {Object.keys(ESTADOS).map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </form>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">ID</th>
              <th className="px-6 py-4 text-left font-semibold">Cliente</th>
              <th className="px-6 py-4 text-left font-semibold">Sucursal</th>
              <th className="px-6 py-4 text-left font-semibold">Total</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pedidosPaginados.map((pedido) => (
              <tr key={pedido.idpedido}>
                <td className="px-6 py-4 font-medium">#{pedido.idpedido}</td>
                <td className="px-6 py-4">{pedido.nombre} {pedido.apellido}</td>
                <td className="px-6 py-4">{getSucursal(pedido)}</td>
                <td className="px-6 py-4 font-bold text-green-600">
                  S/ {calcularTotal(pedido).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => abrirDetalle(pedido)}
                      className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded"
                      title="Detalle"
                    >
                      <FiInfo />
                    </button>
                    <button
                      onClick={() => abrirActualizarEstado(pedido)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded"
                      title="Actualizar Estado"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => abrirEliminar(pedido)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPaginaActual(n)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                paginaActual === n ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}


      {showDetailModal && selectedPedido && (
        <DetallePedidoModal pedido={selectedPedido} onClose={() => setShowDetailModal(false)} />
      )}
      {showDeleteModal && selectedPedido && (
        <EliminarPedidoModal
          pedido={selectedPedido}
          onClose={() => setShowDeleteModal(false)}
          onDeleted={() => {
            setShowDeleteModal(false);
            fetchPedidos();
          }}
        />
      )}
      {showEstadoModal && selectedPedido && (
        <ActualizarEstadoModal
          pedido={selectedPedido}
          onClose={() => setShowEstadoModal(false)}
          cargarPedidos={fetchPedidos}
          ESTADOS={ESTADOS}
          TRANSICIONES_VALIDAS={TRANSICIONES_VALIDAS}
        />
      )}
    </div>
  );
};

export default Pedidos;
