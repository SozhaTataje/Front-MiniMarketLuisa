import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../../../api/axiosInstance";
import uploadImageToCloudinary from "../../../utils/uploadImageToCloudinary";

const EditProductModal = ({ isOpen, onClose, producto, onProductUpdated }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    imagen: "",
    estado: true,
    idcategoria: 1,
    stock: 0,
    idProductoSucursal: null,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (producto) {
      const prod = producto.producto || producto;
      const stock = producto.stock ?? 0;
      const idProductoSucursal = producto.idProductoSucursal ?? null;

      setForm({
        nombre: prod?.nombre || "",
        descripcion: prod?.descripcion || "",
        precio: prod?.precio || 0,
        imagen: prod?.imagen || "",
        estado: prod?.estado ?? true,
        idcategoria: prod?.idcategoria ?? 1,
        stock: stock,
        idProductoSucursal: idProductoSucursal,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImageToCloudinary(file);
    if (url) {
      setForm((prev) => ({ ...prev, imagen: url }));
    } else {
      alert("Error al subir la imagen.");
    }
    setUploading(false);
  };

  const handleUpdate = async () => {
    try {
      const idProducto =
        producto?.producto?.idproducto || producto?.idproducto || null;
      const idSucursal =
        producto?.sucursal?.idsucursal || producto?.idsucursal || null;

      if (!idProducto) {
        alert("No se encontró el ID del producto.");
        return;
      }
      if (!idSucursal) {
        alert("No se encontró el ID de la sucursal.");
        return;
      }

      await api.put(`/producto/update/${idProducto}`, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio,
        imagen: form.imagen,
        estado: form.estado,
        idcategoria: form.idcategoria,
      });

      await api.put("/productosucursal/stock/actualizar", null, {
        params: {
          idProducto: idProducto,
          idSucursal: idSucursal,
          stock: form.stock,
        },
      });

      alert("Producto actualizado correctamente.");
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar producto. Revisa la consola.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-start md:items-center z-50"
      className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 mt-10 md:mt-0 p-6 overflow-auto max-h-[90vh]"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Editar Producto
      </h2>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Nombre:</label>
            <input
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Precio:</label>
            <input
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              name="precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Descripción:</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            name="descripcion"
            rows={3}
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Imagen del producto:
          </label>

          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            id="fileInput"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => document.getElementById("fileInput").click()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Seleccionar imagen
          </button>

          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Subiendo imagen...</p>
          )}

          {form.imagen && (
            <img
              src={form.imagen}
              alt="Vista previa"
              className="w-full h-80 object-cover rounded-lg mt-3"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              name="estado"
              checked={form.estado}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Producto activo
          </label>

          <div>
            <label className="block font-semibold mb-1">
              Stock en sucursal:
            </label>
            <input
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              type="number"
              name="stock"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition duration-300"
          disabled={uploading}
        >
          {uploading ? "Subiendo imagen..." : "Actualizar Producto"}
        </button>
      </form>
    </Modal>
  );
};

export default EditProductModal;
