import React, { useEffect, useState } from "react";
import {
  Eye, Edit, Trash2, RefreshCw, MapPin, Plus, Package, Store,
  Filter, Grid, List, Search, TrendingUp, AlertCircle, CheckCircle,
} from "lucide-react";
import CrearProductoModal from "./modals/ProductoGeneralModal/CrearProductoModal";
import EditarProductoModal from "./modals/ProductoGeneralModal/EditarProductoModal";
import VerProductoModal from "./modals/ProductoGeneralModal/VerProductoModal";
import EliminarProductoModal from "./modals/ProductoGeneralModal/EliminarProductoModal";
import GestionarSucursalesModal from "./modals/ProductoGeneralModal/GestionarSucursalesModal";
import ProductoCard from "./modals/ProductoGeneralModal/ProductoCard";
import FiltroProductos from "./Productos/FiltroProductos";
import EstadisticasDashboard from "./Productos/EstadisticasDashboard";
import ListaProductos from "./Productos/ListaProductos";
import ListaProductosSucursal from "./Productos/ListaProductosSucursal";
import toast from "react-hot-toast";
import api from "../../api/axiosInstance";

const ProductosUnificados = () => {
  const [productos, setProductos] = useState([]);
  const [productosSucursal, setProductosSucursal] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState("productos");
  const [tipoVista, setTipoVista] = useState("tabla");
  const [modales, setModales] = useState({
    crear: false,
    editar: false,
    ver: false,
    eliminar: false,
    sucursales: false
  });
  const [filtro, setFiltro] = useState({
    busqueda: "",
    categoria: "",
    sucursal: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [productosRes, productosSucRes, categoriasRes, sucursalesRes] = await Promise.all([
        api.get("/producto/all"),
        api.get("/productosucursal/all"),
        api.get("/categoria/all"),
        api.get("/sucursal/all")
      ]);

      setProductos(productosRes.data);
      setProductosSucursal(productosSucRes.data);
      setCategorias(categoriasRes.data);
      setSucursales(sucursalesRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (modal, producto) => {
    setSelectedProduct(producto);
    setModales(prev => ({ ...prev, [modal]: true }));
  };

  const cerrarModal = (modal) => {
    setSelectedProduct(null);
    setModales(prev => ({ ...prev, [modal]: false }));
  };

  const handleSuccess = (mensaje) => {
    toast.success(mensaje);
    cargarDatos();
  };

  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(filtro.busqueda.toLowerCase());
    const coincideCategoria = !filtro.categoria || p.categoria?.id == filtro.categoria;
    return coincideBusqueda && coincideCategoria;
  });

  const productosSucursalFiltrados = productosSucursal.filter(p => {
    const coincideBusqueda = p.producto?.nombre.toLowerCase().includes(filtro.busqueda.toLowerCase());
    const coincideSucursal = !filtro.sucursal || p.sucursal?.idsucursal == filtro.sucursal;
    return coincideBusqueda && coincideSucursal;
  });


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-600">
        <RefreshCw className="w-6 h-6 animate-spin mr-3" />
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filtros */}
      <FiltroProductos
        filtro={filtro}
        setFiltro={setFiltro}
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        tipoVista={tipoVista}
        setTipoVista={setTipoVista}
        categorias={categorias}
        sucursales={sucursales}
        onCrear={() => abrirModal("crear", null)}
      />

      {/* Estadísticas */}
      <EstadisticasDashboard
        productos={productos}
        productosSucursal={productosSucursal}
        sucursales={sucursales}
      />

      {/* Vista Principal */}
      {vistaActual === "productos" ? (
        tipoVista === "tabla" ? (
          <ListaProductos
            productos={productosFiltrados}
            tipoVista={tipoVista}
            onView={(p) => abrirModal("ver", p)}
            onEdit={(p) => abrirModal("editar", p)}
            onDelete={(p) => abrirModal("eliminar", p)}
            onManageSucursales={(p) => abrirModal("sucursales", p)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {productosFiltrados.map((producto) => (
              <ProductoCard
                key={producto.idproducto}
                producto={producto}
                abrirModal={abrirModal}
              />
            ))}
          </div>
        )
      ) : (
        <ListaProductosSucursal productos={productosSucursalFiltrados} />
      )}

      {/* Modales */}
      <CrearProductoModal
        isOpen={modales.crear}
        onClose={() => cerrarModal("crear")}
        categorias={categorias}
        onSuccess={handleSuccess}
      />
      <EditarProductoModal
        isOpen={modales.editar}
        onClose={() => cerrarModal("editar")}
        producto={selectedProduct}
        categorias={categorias}
        onSuccess={handleSuccess}
      />
      <VerProductoModal
        isOpen={modales.ver}
        onClose={() => cerrarModal("ver")}
        producto={selectedProduct}
      />
      <EliminarProductoModal
        isOpen={modales.eliminar}
        onClose={() => cerrarModal("eliminar")}
        producto={selectedProduct}
        onSuccess={handleSuccess}
      />
      <GestionarSucursalesModal
        isOpen={modales.sucursales}
        onClose={() => cerrarModal("sucursales")}
        producto={selectedProduct}
        sucursales={sucursales}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ProductosUnificados;
