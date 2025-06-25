import { useState } from "react";
import api from "../../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { X, Save } from "lucide-react";

const ModalProducto = ({ isOpen, onClose, producto }) => {
  const [form, setForm] = useState({
    nombre: producto?.nombre || "",
    descripcion: producto?.descripcion || "",
    precio: producto?.precio || 0,
    imagen: producto?.imagen || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await api.put(`/producto/update/${producto.idproducto}`, form);
      toast.success("Producto actualizado correctamente");
      onClose();
    } catch  {
      toast.error("Error al actualizar producto");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Editar Producto General</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border rounded p-2"
          />
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border rounded p-2"
          />
          <input
            name="precio"
            value={form.precio}
            onChange={handleChange}
            type="number"
            placeholder="Precio"
            className="w-full border rounded p-2"
          />
          <input
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            placeholder="URL Imagen"
            className="w-full border rounded p-2"
          />
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;
