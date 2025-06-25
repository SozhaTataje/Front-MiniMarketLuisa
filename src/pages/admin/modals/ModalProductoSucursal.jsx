import { useState } from "react";
import api from "../../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { X, Save } from "lucide-react";

const ModalProductoSucursal = ({ isOpen, onClose, productoSucursal }) => {
  const [form, setForm] = useState({
    stock: productoSucursal?.stock || 0,
    estado: productoSucursal?.estado || "ACTIVO",
  });

  const handleChange = (e) => {
    const value = e.target.name === "stock" ? parseInt(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleGuardar = async () => {
    try {
      await api.put("/productosucursal/actualizar", {
        idProducto: productoSucursal.producto.idproducto,
        idSucursal: productoSucursal.sucursal.idsucursal,
        stock: form.stock,
        estado: form.estado,
      });
      toast.success("Producto-sucursal actualizado");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar producto-sucursal");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Editar Producto por Sucursal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>
              <strong>Producto:</strong> {productoSucursal?.producto?.nombre}
            </p>
            <p>
              <strong>Sucursal:</strong> {productoSucursal?.sucursal?.nombre}
            </p>
          </div>

          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            placeholder="Stock"
            className="w-full border rounded p-2"
          />

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
            <option value="ELIMINADO">ELIMINADO</option>
          </select>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProductoSucursal;
