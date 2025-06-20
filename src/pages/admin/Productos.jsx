import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import AddProductModal from "./modals/AddProductModal";
import EditProductModal from "./modals/EditProductModal";


const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);


  useEffect(() => {
    axios
      .get("http://localhost:3600/sucursal/all?param=x")
      .then((res) => {
        setSucursales(res.data);
        if (res.data.length > 0) setSelectedSucursal(res.data[0].idsucursal);
      })
      .catch((e) => console.error("Error cargando sucursales:", e));
  }, []);



  useEffect(() => {
      const fetchProductos = () => {
        if (!selectedSucursal) return;
        setLoading(true);
        axios
          .get(`http://localhost:3600/productosucursal/sucursal/${selectedSucursal}`)
          .then((res) => {
            console.log("Productos recargados:", res.data);
            setProductos(res.data);
          })
          .catch((e) => console.error("Error cargando productos:", e))
          .finally(() => setLoading(false));
      };

    fetchProductos();
    }, [selectedSucursal]);

  const handleEditClick = (productoSucursal) => {
    if (!productoSucursal.sucursal) {
      productoSucursal.sucursal = { idsucursal: selectedSucursal };
    }
    setEditingProduct(productoSucursal);
    setShowEditModal(true);
  };




  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Gestión de Productos</h1>
        <button
          onClick={() => setShowProductModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          <FiPlus className="text-lg" /> Nuevo Producto
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="sucursal-select" className="mr-2 font-semibold">
          Filtrar por Sucursal:
        </label>
        <select
          id="sucursal-select"
          value={selectedSucursal || ""}
          onChange={(e) => setSelectedSucursal(Number(e.target.value))}
          className="border rounded px-3 py-1"
        >
          {sucursales.map((s) => (
            <option key={s.idsucursal} value={s.idsucursal}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        {loading ? (
          <div className="text-center text-gray-600 py-10">Cargando productos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-purple-100">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map((p, i) => (
                    <tr
                      key={p.idProductoSucursal ?? i}
                      className={`border-b hover:bg-purple-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                      <td className="px-4 py-2">{p.producto?.idproducto}</td>
                      <td className="px-4 py-2">{p.producto?.nombre}</td>
                      <td className="px-4 py-2">{p.stock}</td>
                      <td className="px-4 py-2">S/. {p.producto?.precio}</td>
                      <td className="px-4 py-2 flex gap-4">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar Producto"
                        >
                          <FiEdit /> <span>Editar</span>
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onProductAdded={() => {
          setShowProductModal(false);
          selectedSucursal.fetchProductos();
        }}
        idSucursal={selectedSucursal}
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
            setShowEditModal(false);
            setEditingProduct(null);
           selectedSucursal.fetchProductos();
          }}
        />
      )}

    </div>
  );
};

export default Productos;
