import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit, FiPackage } from "react-icons/fi";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Package,
  TrendingUp,
  Filter,
  Eye,
} from "lucide-react";
import api from "../../api/axiosInstance";
import CrearProductoModal from "./modals/ProductoGeneralModal/CrearProductoModal";
import EditarProductoModal from "./modals/ProductoGeneralModal/EditarProductoModal";
import VerProductoModal from "./modals/ProductoGeneralModal/VerProductoModal";
import EliminarProductoModal from "./modals/ProductoGeneralModal/EliminarProductoModal";

const ProductosGenerales = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [modales, setModales] = useState({
    crear: false,
    editar: false,
    ver: false,
    eliminar: false,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filtros, setFiltros] = useState({
    nombre: "",
    categoria: "",
    estado: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timeout = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [success, error]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        api.get("/producto/all"),
        api.get("/categoria/all"),
      ]);
      setProductos(Array.isArray(productosRes.data) ? productosRes.data : []);
      setCategorias(categoriasRes.data || []);
    } catch (err) {
      setError("Error al cargar los datos: " + err.message);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipo, producto = null) => {
    setSelectedProduct(producto);
    setModales((prev) => ({ ...prev, [tipo]: true }));
  };

  const cerrarModales = () => {
    setModales({ crear: false, editar: false, ver: false, eliminar: false });
    setSelectedProduct(null);
  };

  const handleProductoActualizado = (mensaje) => {
    setSuccess(mensaje);
    cargarDatos();
    cerrarModales();
  };

  const productosFiltrados = productos.filter((producto) => {
    const matchNombre =
      !filtros.nombre ||
      producto.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase());
    const matchCategoria =
      !filtros.categoria ||
      producto.categoria?.id?.toString() === filtros.categoria;
    const matchEstado =
      filtros.estado === "" || producto.estado?.toString() === filtros.estado;
    return matchNombre && matchCategoria && matchEstado;
  });

  const stats = {
    total: productos.length,
    activos: productos.filter((p) => p.estado).length,
    precioPromedio: productos.length
      ? productos.reduce((sum, p) => sum + (p.precio || 0), 0) /
        productos.length
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
            <FiPackage /> Gestión de productos{" "}
          </h1>
          <p className="text-gray-600">Gestiona tu catálogo de productos</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Productos"
            value={stats.total}
            icon={Package}
            color="text-purple-600"
          />
          <StatCard
            title="Activos"
            value={stats.activos}
            icon={CheckCircle}
            color="text-purple-600"
          />
          <StatCard
            title="Inactivos"
            value={stats.total - stats.activos}
            icon={AlertCircle}
            color="text-purple-600"
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filtros.nombre}
                  onChange={(e) =>
                    setFiltros({ ...filtros, nombre: e.target.value })
                  }
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 ${
                  showFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => abrirModal("crear")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nuevo Producto
              </button>
              <button
                onClick={cargarDatos}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray px-4 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-10"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg"
                value={filtros.categoria}
                onChange={(e) =>
                  setFiltros({ ...filtros, categoria: e.target.value })
                }
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg"
                value={filtros.estado}
                onChange={(e) =>
                  setFiltros({ ...filtros, estado: e.target.value })
                }
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 ">
          <table className="min-w-full text-sm text-gray-600 ">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 ">Estado</th>
                <th className="px-6 py-4 ">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <tr key={producto.idproducto} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {producto.nombre}
                  </td>
                  <td className="px-6 py-4">
                    {producto.categoria?.name || "—"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-purple-600">
                    S/ {producto.precio?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        producto.estado
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {producto.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirModal("ver", producto)}
                        className="p-2  rounded hover:bg-gray-200"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => abrirModal("editar", producto)}
                        className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => abrirModal("eliminar", producto)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CrearProductoModal
          isOpen={modales.crear}
          onClose={cerrarModales}
          categorias={categorias}
          onSuccess={handleProductoActualizado}
        />
        <EditarProductoModal
          isOpen={modales.editar}
          onClose={cerrarModales}
          producto={selectedProduct}
          categorias={categorias}
          onProductoActualizado={handleProductoActualizado}
        />
        <VerProductoModal
          isOpen={modales.ver}
          onClose={cerrarModales}
          producto={selectedProduct}
        />
        <EliminarProductoModal
          isOpen={modales.eliminar}
          onClose={cerrarModales}
          producto={selectedProduct}
          onSuccess={handleProductoActualizado}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color} opacity-80`} />
      </div>
    </div>
  );
};

export default ProductosGenerales;
