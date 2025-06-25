import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Edit, Trash2, Eye, RefreshCw,
  AlertCircle, CheckCircle, Package, TrendingUp
} from 'lucide-react';
import api from "../../api/axiosInstance";

import CrearProductoModal from './modals/ProductoGeneralModal/CrearProductoModal';
import EditarProductoModal from './modals/ProductoGeneralModal/EditarProductoModal';
import VerProductoModal from './modals/ProductoGeneralModal/VerProductoModal';
import EliminarProductoModal from './modals/ProductoGeneralModal/EliminarProductoModal';

const ProductosGenerales = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '', categoria: '', estado: '' });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timeout = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [success, error]);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/producto/all`);
      setProductos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar los productos: ' + err.message);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await api.get(`/categoria/all`);
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const handleCrear = () => setModalCrearOpen(true);
  const handleEditar = (producto) => {
    setSelectedProduct(producto);
    setModalEditarOpen(true);
  };
  const handleVer = (producto) => {
    setSelectedProduct(producto);
    setModalVerOpen(true);
  };
  const handleEliminar = (producto) => {
    setSelectedProduct(producto);
    setModalEliminarOpen(true);
  };
  const cerrarModales = () => {
    setModalCrearOpen(false);
    setModalEditarOpen(false);
    setModalVerOpen(false);
    setModalEliminarOpen(false);
    setSelectedProduct(null);
  };
  const handleProductoActualizado = (mensaje) => {
    setSuccess(mensaje);
    cargarProductos();
    cerrarModales();
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = productosFiltrados.map(p => p.idproducto).filter(Boolean);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };


  const productosFiltrados = productos.filter(producto => {
    const matchNombre = !filtros.nombre || producto.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase());
    const matchCategoria = !filtros.categoria || producto.categoria?.id?.toString() === filtros.categoria;
    const matchEstado = filtros.estado === '' || producto.estado?.toString() === filtros.estado;
    return matchNombre && matchCategoria && matchEstado;
  });

  const EstadisticasCard = () => {
    const totalProductos = productos.length;
    const productosActivos = productos.filter(p => p.estado).length;
    const productosInactivos = totalProductos - productosActivos;
    const precioPromedio = productos.length > 0
      ? productos.reduce((sum, p) => sum + (p.precio || 0), 0) / productos.length
      : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProductos}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos Activos</p>
              <p className="text-2xl font-bold text-green-600">{productosActivos}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{productosInactivos}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-purple-600">S/ {precioPromedio.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
        <p className="text-gray-600">Administra el catálogo general de productos</p>
      </div>

      <EstadisticasCard />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">×</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800">{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-600 hover:text-green-800">×</button>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filtros.nombre}
                onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            >
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCrear}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </button>
            <button
              onClick={cargarProductos}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedItems.length} producto(s) seleccionado(s)
              </span>
              <button
                onClick={() => setSelectedItems([])}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Limpiar selección
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === productosFiltrados.length && productosFiltrados.length > 0}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              productosFiltrados.map(producto => (
                <tr key={producto.idproducto}>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(producto.idproducto)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, producto.idproducto]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== producto.idproducto));
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-2">{producto.nombre}</td>
                  <td className="px-4 py-2">{producto.categoria?.name || '-'}</td>
                  <td className="px-4 py-2">S/ {producto.precio?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-4 py-2">
                    {producto.estado
                      ? <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Activo</span>
                      : <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Inactivo</span>
                    }
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver"
                      onClick={() => handleVer(producto)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Editar"
                      onClick={() => handleEditar(producto)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                      onClick={() => handleEliminar(producto)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* (No lo repetimos por límite de espacio, pero lo que tienes ya está bien, puedes pegarlo debajo aquí igual) */}

      {/* Modales */}
      <CrearProductoModal
        isOpen={modalCrearOpen}
        onClose={cerrarModales}
        categorias={categorias}
        onProductoCreado={handleProductoActualizado}
      />
      <EditarProductoModal
        isOpen={modalEditarOpen}
        onClose={cerrarModales}
        producto={selectedProduct}
        categorias={categorias}
        onProductoActualizado={handleProductoActualizado}
      />
      <VerProductoModal
        isOpen={modalVerOpen}
        onClose={cerrarModales}
        producto={selectedProduct}
      />
      <EliminarProductoModal
        isOpen={modalEliminarOpen}
        onClose={cerrarModales}
        producto={selectedProduct}
        onProductoEliminado={handleProductoActualizado}
      />
    </div>
  );
};

export default ProductosGenerales;
