import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [sucursalId, setSucursalId] = useState("");

  const query = useQuery();
  const terminoBusqueda = query.get("buscar") || "";

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
        setProductos(res.data);
      })
      .catch((e) => console.error("Error cargando productos:", e))
      .finally(() => setCargando(false));
  }, [sucursalId]);

 const productosFiltrados = productos.filter((p) =>
    p.producto?.nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <section className="py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Productos {terminoBusqueda ? `- Resultados para "${terminoBusqueda}"` : "Destacados"}
      </h2>

      {/* Selector de sucursal */}
      <div className="mb-8 flex justify-center">
        <select
          value={sucursalId}
          onChange={(e) => setSucursalId(e.target.value)}
          className="border p-2 rounded"
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
      ) : productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((p) => (
            <ProductCard key={p.idProductoSucursal} productosucursal={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
