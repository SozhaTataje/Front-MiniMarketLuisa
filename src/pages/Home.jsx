import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosInstance";
import Slider from "../components/Slider";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import UbicacionSelector from "../components/UbicacionSelector";
import { useUbicacion } from "../context/UbicacionContext";
import { FiMapPin, FiSearch } from "react-icons/fi";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sucursalId, setSucursalId] = useState("");
  const { sucursalesDisponibles } = useUbicacion();

  const query = useQuery();
  const terminoBusqueda = query.get("buscar") || "";

  useEffect(() => {
    if (sucursalesDisponibles.length > 0) {
      setSucursalId(sucursalesDisponibles[0].idsucursal);
    }
  }, [sucursalesDisponibles]);

  useEffect(() => {
    if (!sucursalId) return;
    setCargando(true);
    api
      .get(`/productosucursal/sucursal/${sucursalId}`)
      .then((res) => setProductos(res.data))
      .catch((e) => console.error("Error cargando productos:", e))
      .finally(() => setCargando(false));
  }, [sucursalId]);

  const productosFiltrados = productos
    .filter((p) =>
      p.producto?.nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase())
    )
    .slice(0, 6);

  const handleUbicacionChange = () => {
    if (sucursalesDisponibles.length > 0) {
      setSucursalId(sucursalesDisponibles[0].idsucursal);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Slider />

      <section className="py-16 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 drop-shadow-md mb-8">
          Productos Destacados
        </h2>

        <div className="flex items-center gap-4 mb-6 justify-center">
          <UbicacionSelector
            onUbicacionChange={handleUbicacionChange}
            className="w-64"
          />

          {sucursalesDisponibles.length > 1 && (
            <div className="flex items-center gap-2 justify-center">
              <FiMapPin className="text-purple-600" />
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
              >
                {sucursalesDisponibles.map((s) => (
                  <option key={s.idsucursal} value={s.idsucursal}>
                    {s.nombre} - {s.ciudad}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <section className="py-10 px-4 sm:px-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {cargando ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="mt-6 text-gray-600 text-lg">
                  Cargando productos...
                </p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="text-center py-20">
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 p-6 rounded-full">
                    <FiSearch className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {terminoBusqueda
                    ? `No hay productos que coincidan con "${terminoBusqueda}" en esta sucursal.`
                    : "Esta sucursal no tiene productos disponibles en este momento."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Volver atrás
                  </button>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    Ir al inicio
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {productosFiltrados.map((p) => (
                    <div
                      key={p.idProductoSucursal}
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      <ProductCard productosucursal={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
