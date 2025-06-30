import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {  FiBox, FiClipboard, FiLogOut, FiArrowLeft, FiUsers, FiMapPin, FiTrendingUp, FiShoppingBag} from "react-icons/fi";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,ArcElement,LineElement,PointElement,Filler} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,LineElement,PointElement,Title,Tooltip,Legend,Filler);

const DashboardAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ventasHoy: 0,
    pedidosPendientes: 0,
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
      const [resProductos, resPedidos, resUsuarios, ] = await Promise.all([
        api.get("/producto/all?param=x"),
        api.get("/pedido/all"),
        api.get("/api/usuario/all"),
      ]);
      setProductos(resProductos.data);
      setPedidos(resPedidos.data);
      setUsuarios(resUsuarios.data);
      calcularEstadisticas(resPedidos.data, resProductos.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (pedidosData) => {
    const hoy = new Date().toDateString();
    const ventasHoy = pedidosData.filter(p =>
      new Date(p.fecha).toDateString() === hoy && p.estado === "ENTREGADO"
    ).length;
    const pedidosPendientes = pedidosData.filter(p => p.estado === "PENDIENTE").length;
    const ingresosMes = pedidosData
      .filter(p => p.estado === "ENTREGADO")
      .reduce((total, p) =>
        total + (p.pedidoProducto?.reduce((sum, pp) => sum + pp.subtotal, 0) || 0), 0
      );
    setStats({ ventasHoy, pedidosPendientes,  ingresosMes });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBackToHome = () => navigate("/");


  const barData = {
    labels: ["Productos", "Pedidos", "Usuarios", ],
    datasets: [{
      label: "Cantidad",
      data: [productos.length, pedidos.length, usuarios.length],
      backgroundColor: ["#7c3aed", "#9333ea", "#a855f7", "#b575f7"],
      borderRadius: 8,
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Resumen General del Sistema",
        font: { size: 18 },
        color: "#4c1d95",
      }
    }
  };

  const estadosPedidos = pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(estadosPedidos),
    datasets: [{
      data: Object.values(estadosPedidos),
      backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#f97316"],
    }]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Estados de Pedidos",
        font: { size: 16 },
        color: "#4c1d95",
      },
      legend: { position: "bottom" }
    }
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  }).reverse();

  const pedidosPorDia = last7Days.map(day =>
    pedidos.filter(p => new Date(p.fecha).toDateString() === day).length
  );

  const lineData = {
    labels: last7Days.map(d => new Date(d).toLocaleDateString("es-ES", { month: "short", day: "numeric" })),
    datasets: [{
      label: "Pedidos",
      data: pedidosPorDia,
      borderColor: "#7c3aed",
      backgroundColor: "rgba(124, 58, 237, 0.1)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Pedidos - Últimos 7 días",
        font: { size: 16 },
        color: "#4c1d95",
      },
      legend: { display: false }
    }
  };

  const fechaActual = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xl text-gray-600">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Toaster position="top-right" />
      <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button onClick={handleBackToHome} className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium">
            <FiArrowLeft size={20} /> <span>Inicio</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
            <p className="text-sm text-gray-500">{fechaActual}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow">
            <FiLogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </div>

      <div className="p-6">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard label="Ventas Hoy" value={stats.ventasHoy} icon={<FiTrendingUp />} bgColor="bg-green-50" textColor="text-green-700" />
          <StatCard label="Pedidos Pendientes" value={stats.pedidosPendientes} icon={<FiClipboard />} bgColor="bg-orange-50" textColor="text-orange-700" />
          <StatCard label="Ingresos del Mes" value={`S/ ${stats.ingresosMes.toFixed(2)}`} icon={<FiTrendingUp />} bgColor="bg-blue-50" textColor="text-blue-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Productos" value={productos.length} icon={<FiBox />} />
          <StatCard label="Total Pedidos" value={pedidos.length} icon={<FiClipboard />} />
          <StatCard label="Usuarios" value={usuarios.length} icon={<FiUsers />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div style={{ height: "350px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div style={{ height: "350px" }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div style={{ height: "300px" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, bgColor = "bg-white", textColor = "text-purple-700" }) => (
  <div className={`${bgColor} p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className="p-3 bg-white rounded-full shadow-sm text-2xl text-purple-600">
        {icon}
      </div>
    </div>
  </div>
);

export default DashboardAdmin;
