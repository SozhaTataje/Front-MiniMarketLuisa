import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FiPlus, FiTrash2, FiEdit, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axiosInstance";
import AddProductModal from "./modals/ProductoSucursalModal/AddProductModal";
import EditProductModal from "./modals/ProductoSucursalModal/EditProductModal";
import DeleteProductModal from "./modals/ProductoSucursalModal/DeleteProductModal";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const PLACEHOLDER_IMG = useMemo(
    () =>
      `data:image/svg+xml;base64,${btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle" dy=".3em">IMG</text>
      </svg>
    `)}`,
    []
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [sucursalesRes, categoriasRes] = await Promise.all([
          api.get("/sucursal/all?param=x"),
          api.get("/categoria/all"),
        ]);
        setSucursales(sucursalesRes.data);
        setCategorias(categoriasRes.data);
        if (sucursalesRes.data.length > 0) {
          setSelectedSucursal(sucursalesRes.data[0].idsucursal);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar sucursales o categorías");
      }
    };
    loadInitialData();
  }, []);

  const fetchProductosSucursal = useCallback(async () => {
    if (!selectedSucursal) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/productosucursal/sucursal/${selectedSucursal}`
      );
      setProductos(res.data);
    } catch (error) {
      console.error("Error cargando productos de sucursal:", error);
      setProductos([]);
      toast.error("Error al cargar productos de la sucursal");
    } finally {
      setLoading(false);
    }
  }, [selectedSucursal]);

  useEffect(() => {
    if (categorias.length && sucursales.length && selectedSucursal) {
      fetchProductosSucursal();
    }
  }, [
    categorias.length,
    sucursales.length,
    selectedSucursal,
    fetchProductosSucursal,
  ]);

  const handleEditClick = useCallback((producto) => {
    setEditingProduct(producto);
    setShowEditModal(true);
  }, []);

  const handleDeleteClick = useCallback(
    (producto) => {
      setDeletingProduct({
        ...producto,
        sucursal: producto.sucursal || { idsucursal: selectedSucursal },
        idsucursal: producto.idsucursal || selectedSucursal,
      });
      setShowDeleteModal(true);
    },
    [selectedSucursal]
  );

  const refreshData = useCallback(() => {
    fetchProductosSucursal();
  }, [fetchProductosSucursal]);

  const getCategoriaName = useMemo(
    () => (idCategoria) => {
      const categoria = categorias.find((c) => c.id === idCategoria);
      return categoria ? categoria.name : "Sin categoría";
    },
    [categorias]
  );

  const getSucursalName = useMemo(
    () => (idSucursal) => {
      const s = sucursales.find((s) => s.idsucursal === idSucursal);
      return s ? s.nombre : "Desconocida";
    },
    [sucursales]
  );

  const getStockColor = useCallback((stock) => {
    if (stock === 0) return "text-red-600 bg-red-100";
    if (stock < 10) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
            <FiPackage /> Gestión de Productos
          </h1>
          <p className="text-gray-600 mt-1">Productos por sucursal</p>
        </div>
        <button
          onClick={() => setShowProductModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          <FiPlus /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-4 flex-wrap">
        {sucursales.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700">Sucursal:</label>
            <select
              value={selectedSucursal || ""}
              onChange={(e) => setSelectedSucursal(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-purple-500"
            >
              {sucursales.map((s) => (
                <option key={s.idsucursal} value={s.idsucursal}>
                  {s.nombre} - {s.ciudad}
                </option>
              ))}
            </select>
          </div>
        )}

        <span className="text-xs text-gray-500">
        </span>
        <span className="text-sm text-gray-500">
          {productos.length} productos encontrados
        </span>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            Cargando productos...
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay productos
            </h3>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Agregar producto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase"> Producto </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase"> Categoría </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase"> Stock </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase"> Precio </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase"> Estado </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase"> Acciones </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((p, i) => {
                  const producto = p.producto;
                  const categoriaId =
                    producto?.categoria?.id || producto?.idcategoria;

                  return (
                    <tr
                      key={producto?.idproducto || i}
                      className="hover:bg-purple-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                            src={producto?.imagen || PLACEHOLDER_IMG}
                            alt={producto?.nombre}
                            onError={(e) => {
                              e.target.src = PLACEHOLDER_IMG;
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {producto?.nombre || "Sin nombre"}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {producto?.descripcion || "Sin descripción"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {getCategoriaName(categoriaId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStockColor(
                            p.stock
                          )}`}
                        >
                          {p.stock || 0} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        S/ {(producto?.precio || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            producto?.estado
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {producto?.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onProductAssigned={() => {
          toast.success("Producto agregado con éxito");
          setShowProductModal(false);
          refreshData();
        }}
        idSucursal={selectedSucursal}
        categorias={categorias}
        sucursales={sucursales}
      />

      {editingProduct && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          producto={editingProduct}
          onProductUpdated={() => {
            toast.success("Producto actualizado correctamente");
            setShowEditModal(false);
            setEditingProduct(null);
            refreshData();
          }}
          categorias={categorias}
          sucursales={sucursales}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingProduct(null);
          }}
          producto={deletingProduct}
          onProductDeleted={() => {
            toast.success("Producto eliminado correctamente");
            setShowDeleteModal(false);
            setDeletingProduct(null);
            refreshData();
          }}
          sucursalName={getSucursalName(selectedSucursal)}
        />
      )}
    </div>
  );
};

export default Productos;
