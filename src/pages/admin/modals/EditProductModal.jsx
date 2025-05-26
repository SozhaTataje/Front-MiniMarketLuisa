import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../../../api/axiosInstance";

const EditProductModal = ({ isOpen, onClose, producto, onProductUpdated }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    imagen: "",
    estado: true,
    idcategoria: 1,
  });

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || 0,
        imagen: producto.imagen || "",
        estado: producto.estado ?? true,
        idcategoria: producto.idcategoria ?? 1,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/producto/update/${producto.idproducto}`, form);
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
      className="p-6 bg-white rounded shadow-lg max-w-md mx-auto mt-20"
    >
      <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
      <input
        className="w-full mb-2 p-2 border"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre"
      />
      <textarea
        className="w-full mb-2 p-2 border"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
      />
      <input
        className="w-full mb-2 p-2 border"
        name="precio"
        type="number"
        value={form.precio}
        onChange={handleChange}
        placeholder="Precio"
      />
      <input
        className="w-full mb-2 p-2 border"
        name="imagen"
        value={form.imagen}
        onChange={handleChange}
        placeholder="Imagen (URL)"
      />
      <label className="flex items-center gap-2 mt-2 mb-2">
        <input
          type="checkbox"
          name="estado"
          checked={form.estado}
          onChange={handleChange}
        />
        <span>¿Activo?</span>
      </label>
      <input
        className="w-full mb-2 p-2 border"
        type="number"
        name="idcategoria"
        value={form.idcategoria}
        onChange={handleChange}
        placeholder="ID Categoría"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Actualizar
      </button>
    </Modal>
  );
};

export default EditProductModal;
