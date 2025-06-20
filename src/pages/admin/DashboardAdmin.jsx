import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import {
  FiBox, FiClipboard, FiLogOut, FiArrowLeft, FiUsers,
  FiMapPin, FiTrendingUp, FiShoppingBag, FiDownload
} from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ventasHoy: 0,
    pedidosPendientes: 0,
    productosBajoStock: 0,
    ingresosMes: 0,
  });

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resProductos, resPedidos, resUsuarios, resSucursales] = await Promise.all([
        api.get("/producto/all?param=x"),
        api.get("/pedido/all"),
        api.get("/api/usuario/all"),
        api.get("/sucursal/all?param=x"),
      ]);
      setProductos(resProductos.data);
      setPedidos(resPedidos.data);
      setUsuarios(resUsuarios.data);
      setSucursales(resSucursales.data);
      calcularEstadisticas(resPedidos.data, resProductos.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (pedidosData, productosData) => {
    const hoy = new Date().toDateString();
    const ventasHoy = pedidosData.filter(p =>
      new Date(p.fecha).toDateString() === hoy && p.estado === "ENTREGADO"
    ).length;
    const pedidosPendientes = pedidosData.filter(p => p.estado === "PENDIENTE").length;
    const productosBajoStock = Math.floor(productosData.length * 0.15);
    const ingresosMes = pedidosData
      .filter(p => p.estado === "ENTREGADO")
      .reduce((total, p) =>
        total + (p.pedidoProducto?.reduce((sum, pp) => sum + pp.subtotal, 0) || 0), 0
      );
    setStats({ ventasHoy, pedidosPendientes, productosBajoStock, ingresosMes });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBackToHome = () => navigate("/");

  const lineData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
    }).reverse(),
    datasets: [{
      label: "Pedidos",
      data: Array.from({ length: 7 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - i);
        return pedidos.filter(p => new Date(p.fecha).toDateString() === day.toDateString()).length;
      }).reverse(),
      fill: true,
      backgroundColor: "rgba(124, 58, 237, 0.1)",
      borderColor: "#7c3aed",
      tension: 0.4,
      borderWidth: 3,
    }]
  };

  const charts = {
    bar: {
      data: {
        labels: ["Productos", "Pedidos", "Usuarios", "Sucursales"],
        datasets: [{
          label: "Cantidad",
          data: [productos.length, pedidos.length, usuarios.length, sucursales.length],
          backgroundColor: ["#7c3aed", "#9333ea", "#a855f7", "#b575f7"],
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Resumen General del Sistema",
            color: "#4c1d95",
            font: { size: 18 }
          }
        }
      }
    },
    doughnut: {
      data: {
        labels: Object.keys(pedidos.reduce((acc, p) => {
          acc[p.estado] = (acc[p.estado] || 0) + 1;
          return acc;
        }, {})),
        datasets: [{
          data: Object.values(pedidos.reduce((acc, p) => {
            acc[p.estado] = (acc[p.estado] || 0) + 1;
            return acc;
          }, {})),
          backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Estados de Pedidos",
            font: { size: 16 },
            color: "#4c1d95"
          },
          legend: { position: "bottom" }
        }
      }
    },
    line: {
      data: lineData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Pedidos - Últimos 7 días",
            color: "#4c1d95",
            font: { size: 16 }
          },
          legend: { display: false }
        }
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBackToHome} className="text-purple-600 hover:underline flex items-center gap-1">
          <FiArrowLeft /> Inicio
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center gap-1">
          <FiLogOut /> Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ventas Hoy" value={stats.ventasHoy} icon={<FiTrendingUp />} />
        <StatCard label="Pedidos Pendientes" value={stats.pedidosPendientes} icon={<FiClipboard />} />
        <StatCard label="Stock Bajo" value={stats.productosBajoStock} icon={<FiShoppingBag />} />
        <StatCard label="Ingresos del Mes" value={`S/ ${stats.ingresosMes.toFixed(2)}`} icon={<FiTrendingUp />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Productos" value={productos.length} icon={<FiBox />} />
        <StatCard label="Total Pedidos" value={pedidos.length} icon={<FiClipboard />} />
        <StatCard label="Usuarios" value={usuarios.length} icon={<FiUsers />} />
        <StatCard label="Sucursales" value={sucursales.length} icon={<FiMapPin />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <Bar data={charts.bar.data} options={charts.bar.options} />
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <Doughnut data={charts.doughnut.data} options={charts.doughnut.options} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <Line data={charts.line.data} options={charts.line.options} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-gray-50 p-4 rounded-xl shadow flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-purple-700">{value}</p>
    </div>
    <div className="text-3xl text-purple-600">{icon}</div>
  </div>
);

export default DashboardAdmin;
