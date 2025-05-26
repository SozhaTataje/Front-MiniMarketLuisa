import React, { useState, useRef } from "react";
import api from "../../../api/axiosInstance";
import uploadImageToCloudinary from "../../../utils/uploadImageToCloudinary";

const AddProductModal = ({ isOpen, onClose, onProductAdded, idSucursal }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [imagen, setImagen] = useState("");
  const [estado, setEstado] = useState(true);
  const [idCategoria, setIdCategoria] = useState(1);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadImageToCloudinary(file);
    setUploading(false);

    if (imageUrl) {
      setImagen(imageUrl);
      alert("Imagen subida con éxito.");
    } else {
      alert("Error al subir imagen.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productRequest = {
        nombre,
        descripcion,
        precio,
        imagen,
        estado,
        idcategoria: idCategoria,
      };

      const resSave = await api.post("/producto/save", productRequest);
      alert(resSave.data);

      const resAll = await api.get("/producto/all");
      const productoCreado = resAll.data.find(
        (p) => p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
      );

      if (!productoCreado) {
        alert("No se pudo obtener el ID del producto creado.");
        setLoading(false);
        return;
      }

      const productoSucursalRequest = {
        producto: productoCreado.idproducto,
        sucursal: idSucursal,
        stock,
      };

      await api.post("/productosucursal/agregar", productoSucursalRequest);
      alert("Producto agregado a la sucursal correctamente.");

      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setImagen("");
      setEstado(true);
      setIdCategoria(1);
      setStock(0);

      onProductAdded();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Producto a Sucursal</h2>

        <label className="block mb-2">
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-2">
          Descripción:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-2">
          Precio:
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(parseFloat(e.target.value))}
            required
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-2">
          Imagen:
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded mt-2"
            disabled={uploading}
          >
            {uploading ? "Subiendo imagen..." : "Seleccionar imagen"}
          </button>
        </label>

        {imagen && (
          <img
            src={imagen}
            alt="Vista previa"
            className="w-full h-40 object-cover mt-3 rounded border"
          />
        )}

        <label className="block mb-2 mt-4">
          Estado:
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value === "true")}
            className="border p-2 w-full"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </label>

        <label className="block mb-2">
          ID Categoría:
          <input
            type="number"
            value={idCategoria}
            onChange={(e) => setIdCategoria(parseInt(e.target.value))}
            required
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-4">
          Stock inicial:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
            required
            className="border p-2 w-full"
          />
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductModal;
