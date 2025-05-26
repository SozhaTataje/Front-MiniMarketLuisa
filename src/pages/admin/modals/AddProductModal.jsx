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
  <div
  className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50 p-2"
  style={{ backdropFilter: 'blur(4px)' }}
>
  <form
    onSubmit={handleSubmit}
    className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto p-6 animate-fadeIn"
  >
      <h2 className="text-2xl font-extrabold mb-6 text-purple-700 text-center">
        Agregar Producto a Sucursal
      </h2>

      <label className="block mb-4">
        <span className="block font-semibold mb-1 text-gray-700">Nombre:</span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-3 w-full
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1 text-gray-700">Descripción:</span>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows={3}
          className="border border-gray-300 rounded-md p-3 w-full
                     focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1 text-gray-700">Precio:</span>
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(parseFloat(e.target.value))}
          required
          className="border border-gray-300 rounded-md p-3 w-full
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-2 text-gray-700">Imagen:</span>
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
          className={`w-full py-3 rounded-md text-white font-semibold
                      ${uploading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
                      transition-colors duration-300`}
          disabled={uploading}
        >
          {uploading ? "Subiendo imagen..." : "Seleccionar imagen"}
        </button>
      </label>

      {imagen && (
        <img
          src={imagen}
          alt="Vista previa"
          className="w-full h-44 object-cover rounded-md border border-gray-300 mt-3 shadow-sm"
        />
      )}

      <label className="block mb-4">
        <span className="block font-semibold mb-1 text-gray-700">Estado:</span>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value === "true")}
          className="border border-gray-300 rounded-md p-3 w-full
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1 text-gray-700">ID Categoría:</span>
        <input
          type="number"
          value={idCategoria}
          onChange={(e) => setIdCategoria(parseInt(e.target.value))}
          required
          className="border border-gray-300 rounded-md p-3 w-full
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </label>

      <label className="block mb-6">
        <span className="block font-semibold mb-1 text-gray-700">Stock inicial:</span>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          required
          className="border border-gray-300 rounded-md p-3 w-full
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </label>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md font-semibold
                     text-gray-700 hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`px-6 py-2 rounded-md font-semibold text-white
                      ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
                      transition-colors duration-300`}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  </div>
);
}
export default AddProductModal;
