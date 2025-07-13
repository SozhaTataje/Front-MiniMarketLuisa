import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiSearch, FiMapPin, FiShoppingBag } from "react-icons/fi";
import Footer from "../components/Footer";
import UbicacionSelector from "../components/UbicacionSelector";
import { useUbicacion } from "../context/UbicacionContext";
import api from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductList = () => {
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

  const productosFiltrados = productos.filter((p) =>
    p.producto?.nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const sucursalActual = sucursalesDisponibles.find((s) => s.idsucursal == sucursalId);

  const handleUbicacionChange = () => {
 
    if (sucursalesDisponibles.length > 0) {
      setSucursalId(sucursalesDisponibles[0].idsucursal);
    }
  };

  return (
    <>
      <header className="bg-purple-50 border-b border-purple-100 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="text-purple-600 w-7 h-7" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {terminoBusqueda ? (
                  <>
                    Resultados para{" "}
                    <span className="text-purple-600">"{terminoBusqueda}"</span>
                  </>
                ) : (
                  "Listado de Productos"
                )}
              </h1>
              <p className="text-sm text-gray-600">
                {productosFiltrados.length} producto
                {productosFiltrados.length !== 1 ? "s" : ""} disponible
                {productosFiltrados.length !== 1 ? "s" : ""} en{" "}
                {sucursalActual?.nombre || "Sucursal"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UbicacionSelector 
              onUbicacionChange={handleUbicacionChange}
              className="w-64"
            />
            
            {sucursalesDisponibles.length > 1 && (
              <div className="flex items-center gap-2">
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
        </div>
      </header>

      <section className="py-10 px-4 sm:px-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-600 text-lg">Cargando productos...</p>
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Productos disponibles
                  </h2>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {productosFiltrados.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {productosFiltrados.map((p) => (
                  <div key={p.idProductoSucursal} className="hover:scale-105 transition-transform duration-300">
                    <ProductCard productosucursal={p} />
                  </div>
                ))}
              </div>

              {productosFiltrados.length >= 12 && (
                <div className="text-center">
                  <button className="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all font-semibold">
                    Ver más productos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductList;
