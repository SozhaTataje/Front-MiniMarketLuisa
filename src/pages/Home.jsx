import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "../components/Slider";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalId, setSucursalId] = useState("");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3600/sucursal/all?param=x")
      .then((res) => {
        setSucursales(res.data);
        if (res.data.length > 0) setSucursalId(res.data[0].idsucursal);
      })
      .catch((e) => console.error("Error cargando sucursales:", e));
  }, []);

  useEffect(() => {
    if (!sucursalId) return;

    setCargando(true);
    axios
      .get(`http://localhost:3600/productosucursal/sucursal/${sucursalId}`)
      .then((res) => {
        setProductos(res.data.slice(0, 6));
      })
      .catch((e) => console.error("Error cargando productos:", e))
      .finally(() => setCargando(false));
  }, [sucursalId]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Slider />

      <section className="py-16 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 drop-shadow-md mb-8">
          Productos Destacados
        </h2>

        {/* Selector de sucursal */}
        <div className="mb-8 flex justify-center">
          <select
            value={sucursalId}
            onChange={(e) => setSucursalId(e.target.value)}
            className="border p-2 rounded w-full max-w-xs sm:max-w-sm"
          >
            {sucursales.map((suc) => (
              <option key={suc.idsucursal} value={suc.idsucursal}>
                {suc.nombre}
              </option>
            ))}
          </select>
        </div>

        {cargando ? (
          <p className="text-center">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productos.map((prodSuc) => (
              <ProductCard
                key={prodSuc.idProductoSucursal}
                productosucursal={prodSuc}
              />
            ))}
          </div>
        )}
        <div className="mt-12 flex justify-center">
          <Link
            to="/productos"
             className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-purple-700 transition"
          >
            Ver todos los productos
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
