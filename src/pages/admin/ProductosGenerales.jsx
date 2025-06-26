import React, { useState, useEffect } from "react";
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

  const StatCard = ({ title, value, icon, color }) => {
    const IconComponent = icon;
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <IconComponent className={`h-8 w-8 ${color} opacity-20`} />
        </div>
      </div>
    );
  };

  const ProductCard = ({ producto }) => (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="aspect-square bg-gray-50 relative group">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              producto.estado
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {producto.estado ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {producto.categoria?.name || "Sin categoría"}
        </p>
        <p className="text-lg font-bold text-blue-600 mb-3">
          S/ {producto.precio?.toFixed(2) ?? "0.00"}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => abrirModal("ver", producto)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            Ver
          </button>
          <button
            onClick={() => abrirModal("editar", producto)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => abrirModal("eliminar", producto)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Productos</h1>
          <p className="text-gray-600">Gestiona tu catálogo de productos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Productos"
            value={stats.total}
            icon={Package}
            color="text-blue-600"
          />
          <StatCard
            title="Activos"
            value={stats.activos}
            icon={CheckCircle}
            color="text-green-600"
          />
          <StatCard
            title="Inactivos"
            value={stats.total - stats.activos}
            icon={AlertCircle}
            color="text-red-600"
          />
          <StatCard
            title="Precio Promedio"
            value={`S/ ${stats.precioPromedio.toFixed(2)}`}
            icon={TrendingUp}
            color="text-purple-600"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <span className="text-red-800 flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-green-800 flex-1">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="text-green-600 hover:text-green-800 ml-2"
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={filtros.nombre}
                  onChange={(e) =>
                    setFiltros({ ...filtros, nombre: e.target.value })
                  }
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nuevo Producto
              </button>
              <button
                onClick={cargarDatos}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
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
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay productos
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando tu primer producto
            </p>
            <button
              onClick={() => abrirModal("crear")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear Producto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.idproducto} producto={producto} />
            ))}
          </div>
        )}

        {/* Modales */}
        <CrearProductoModal
          isOpen={modales.crear}
          onClose={cerrarModales}
          categorias={categorias}
          onProductoCreado={handleProductoActualizado}
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
          onProductoEliminado={handleProductoActualizado}
        />
      </div>
    </div>
  );
};

export default ProductosGenerales;
