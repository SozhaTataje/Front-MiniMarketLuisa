import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiMapPin, FiPackage } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../../../api/axiosInstance";

const AddProductModal = ({ isOpen, onClose, onProductAssigned, sucursales = [] }) => {
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selectedSucursales, setSelectedSucursales] = useState([]);
  const [stockBySucursal, setStockBySucursal] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      producto: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedSucursales([]);
      setStockBySucursal({});
      fetchProductos();
    }
  }, [isOpen]);

  const fetchProductos = async () => {
    try {
      const response = await api.get("/producto/all");
      setProductos(response.data || []);
    } catch {
      toast.error("Error al cargar productos");
    }
  };

  const handleSucursalToggle = (id) => {
    setSelectedSucursales((prev) => {
      const updated = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      setStockBySucursal((prevStock) => {
        const newStock = { ...prevStock };
        if (updated.includes(id)) newStock[id] = newStock[id] || 0;
        else delete newStock[id];
        return newStock;
      });
      return updated;
    });
  };

  const handleStockChange = (id, stock) => {
    setStockBySucursal((prev) => ({
      ...prev,
      [id]: Math.max(0, parseInt(stock) || 0),
    }));
  };

  // ✅ ahora recibimos "data" del formulario
  const onSubmit = async (data) => {
    const selectedProductId = parseInt(data.producto);
    if (!selectedProductId) {
      toast.error("Seleccione un producto");
      return;
    }
    if (selectedSucursales.length === 0) {
      toast.error("Seleccione al menos una sucursal");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        selectedSucursales.map((id) =>
          api.post("/productosucursal/agregar", {
            producto: selectedProductId,
            sucursal: id,
            stock: stockBySucursal[id] || 0,
          })
        )
      );
      toast.success("Producto asignado correctamente");
      onProductAssigned(); // 🔁 actualiza la lista en el padre
      onClose(); // ✅ cierra el modal
    } catch (error) {
      toast.error(error.response?.data || "Error al asignar sucursales");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <FiPackage className="text-purple-600 text-xl" />
            <div>
              <h2 className="text-xl font-bold">Asignar Producto a Sucursales</h2>
              <p className="text-sm text-gray-500">
                Selecciona un producto y asígnalo a una o más sucursales
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading}>
            <FiX className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Producto *</label>
            <select
              {...register("producto", { required: "Debe seleccionar un producto" })}
              className={`w-full px-4 py-2 rounded-xl bg-gray-50 border ${
                errors.producto ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione un producto...</option>
              {productos.map((p) => (
                <option key={p.idproducto} value={p.idproducto}>
                  {p.nombre} - S/ {p.precio?.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.producto && (
              <p className="text-red-500 text-sm mt-1">{errors.producto.message}</p>
            )}
          </div>

          {/* Sucursales */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiMapPin /> Seleccionar Sucursales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {sucursales.map((s) => {
                const isSelected = selectedSucursales.includes(s.idsucursal);
                return (
                  <div
                    key={s.idsucursal}
                    onClick={() => handleSucursalToggle(s.idsucursal)}
                    className={`p-4 rounded-xl shadow-sm cursor-pointer transition-all ${
                      isSelected ? "bg-purple-100 border border-purple-400" : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <h4 className="font-semibold text-gray-800">{s.nombre}</h4>
                    <p className="text-sm text-gray-500">{s.ciudad}</p>
                    {isSelected && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">
                          Stock inicial
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={stockBySucursal[s.idsucursal] || 0}
                          onChange={(e) =>
                            handleStockChange(s.idsucursal, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || selectedSucursales.length === 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Asignar Sucursales
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
