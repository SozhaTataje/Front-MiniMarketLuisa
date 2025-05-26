import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axiosInstance";
import { FiBox, FiClipboard, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Chart as ChartJS, CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title,Tooltip,Legend);

const DashboardAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProductos, resPedidos] = await Promise.all([
        api.get("/producto/all?param=x"),
        api.get("/pedido/all"),
      ]);
      setProductos(resProductos.data);
      setPedidos(resPedidos.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/");};

  const handleBackToHome = () => {navigate("/");};

  const data = {
    labels: ["Productos", "Pedidos"],
    datasets: [
      {
        label: "Cantidad",
        data: [productos.length, pedidos.length],
        backgroundColor: ["#7c3aed", "#9333ea"],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Cantidad total de Productos y Pedidos",
        font: { size: 20, weight: "bold" },
        color: "#4c1d95",
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.parsed.y} items`,
        },
      },
    },
    scales: {  y: { beginAtZero: true, ticks: { font: { size: 14 } }, grid: { color: "#e5e7eb" }, },
      x: {ticks: { font: { size: 14 } }, grid: { color: "#f3f4f6" }, },},};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition"
          title="Volver al inicio"
        >
          <FiArrowLeft size={24} />
          <span className="text-lg font-medium">Inicio</span>
        </button>

        <h1 className="text-2xl font-bold text-purple-800">Dashboard Admin</h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded shadow"
          title="Cerrar sesión"
        >
          <FiLogOut />
          Cerrar sesión
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Cargando datos...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard
              label="Productos"
              value={productos.length}
              icon={<FiBox size={40} className="text-purple-600" />}
            />
            <StatCard
              label="Pedidos"
              value={pedidos.length}
              icon={<FiClipboard size={40} className="text-purple-600" />}
            />
          </div>

          <div
            className="bg-white p-6 rounded shadow max-w-5xl mx-auto mt-8 center"
            style={{ height: "400px" }}
          >
            <Bar data={data} options={options} />
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
    {icon}
    <div>
      <h4 className="text-gray-500">{label}</h4>
      <p className="text-2xl font-bold text-purple-700">{value}</p>
    </div>
  </div>
);

export default DashboardAdmin;
