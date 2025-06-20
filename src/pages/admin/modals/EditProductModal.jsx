import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import api from "../../../api/axiosInstance";
import uploadImageToCloudinary from "../../../utils/uploadImageToCloudinary";
import { FiUpload, FiX, FiPackage, FiDollarSign, FiTag, FiMapPin, FiSave, FiImage } from "react-icons/fi";

const EditProductModal = ({ isOpen, onClose, producto, onProductUpdated, categorias, sucursales }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    estado: true,
    idcategoria: 1,
    stock: "",
    idProductoSucursal: null,
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Usar useCallback para evitar renders innecesarios
  const resetForm = useCallback(() => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      estado: true,
      idcategoria: 1,
      stock: "",
      idProductoSucursal: null,
    });
    setErrors({});
  }, []);

  useEffect(() => {
    if (producto && isOpen) {
      console.log("Producto recibido:", producto);
      
      // Mejorar la extracción de datos del producto
      const prod = producto.producto || producto;
      const stock = producto.stock ?? 0;
      const idProductoSucursal = producto.idProductoSucursal ?? null;

      // Manejar categoría de manera más robusta
      let categoryId = 1;
      if (prod?.categoria?.id) {
        categoryId = prod.categoria.id;
      } else if (prod?.idcategoria) {
        categoryId = prod.idcategoria;
      } else if (categorias && categorias.length > 0) {
        categoryId = categorias[0].id;
      }

      const formData = {
        nombre: prod?.nombre || "",
        descripcion: prod?.descripcion || "",
        precio: prod?.precio ? prod.precio.toString() : "",
        imagen: prod?.imagen || "",
        estado: prod?.estado ?? true,
        idcategoria: categoryId,
        stock: stock.toString(),
        idProductoSucursal: idProductoSucursal,
      };

      console.log("Formulario configurado:", formData);
      setForm(formData);
      setErrors({});
    } else if (!isOpen) {
      resetForm();
    }
  }, [producto, isOpen, resetForm, categorias]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!form.precio || parseFloat(form.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (form.stock === "" || parseInt(form.stock) < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (!form.idcategoria) {
      newErrors.idcategoria = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert("Por favor selecciona un archivo de imagen");
      return;
    }

    // Validar tamaño de archivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        setForm((prev) => ({ ...prev, imagen: url }));
        alert("Imagen actualizada correctamente");
      } else {
        alert("Error al subir la imagen.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Extraer IDs de manera más robusta
      const idProducto = producto?.producto?.idproducto || producto?.idproducto;
      const idSucursal = producto?.sucursal?.idsucursal || producto?.idsucursal;

      console.log("IDs extraídos:", { idProducto, idSucursal, producto });

      if (!idProducto) {
        throw new Error("No se encontró el ID del producto. Estructura: " + JSON.stringify(producto));
      }
      if (!idSucursal) {
        throw new Error("No se encontró el ID de la sucursal. Estructura: " + JSON.stringify(producto));
      }

      // Preparar datos para actualizar
      const productData = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: parseFloat(form.precio),
        imagen: form.imagen || null,
        estado: form.estado,
        idcategoria: parseInt(form.idcategoria),
      };

      console.log("Actualizando producto con datos:", productData);

      // Actualizar producto general
      const updateProductResponse = await api.put(`/producto/update/${idProducto}`, productData);
      console.log("Producto actualizado:", updateProductResponse.data);

      // Actualizar stock en la sucursal específica
      const stockData = {
        idProducto: idProducto,
        idSucursal: idSucursal,
        stock: parseInt(form.stock),
      };

      console.log("Actualizando stock con:", stockData);

      const updateStockResponse = await api.put("/productosucursal/stock/actualizar", null, {
        params: stockData,
      });
      console.log("Stock actualizado:", updateStockResponse.data);

      alert("Producto actualizado correctamente.");
      
      // Llamar callback para actualizar la lista
      if (onProductUpdated) {
        onProductUpdated();
      }
      onClose();
    } catch (error) {
      console.error("Error completo al actualizar producto:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      
      let errorMessage = "Error desconocido al actualizar el producto";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert("Error al actualizar producto: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaName = (idCategoria) => {
    const categoria = categorias?.find(c => c.id === parseInt(idCategoria));
    return categoria ? categoria.name : 'Sin categoría';
  };

  const getSucursalName = () => {
    const idSucursal = producto?.sucursal?.idsucursal || producto?.idsucursal;
    const sucursal = sucursales?.find(s => s.idsucursal === idSucursal);
    return sucursal ? `${sucursal.nombre} - ${sucursal.ciudad}` : 'Sucursal desconocida';
  };

  // Generar imagen placeholder segura
  const getPlaceholderImage = () => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
          Sin imagen
        </text>
      </svg>
    `)}`;
  };

  if (!isOpen || !producto) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!loading ? onClose : undefined}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[95vh] overflow-auto"
      shouldCloseOnOverlayClick={!loading}
      shouldCloseOnEsc={!loading}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50 rounded-t-2xl">
        <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
          <FiPackage className="text-xl" />
          Editar Producto
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          disabled={loading}
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      {/* Información de sucursal */}
      <div className="p-6 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center gap-2 text-blue-700">
          <FiMapPin className="h-5 w-5" />
          <span className="font-semibold">Editando en sucursal:</span>
          <span className="font-bold">{getSucursalName()}</span>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Información básica */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiTag className="text-purple-600" />
                Información del Producto
              </h3>

              {/* Nombre */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el nombre del producto"
                  disabled={loading}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Describe las características del producto..."
                  disabled={loading}
                />
              </div>

              {/* Categoría */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="idcategoria"
                  value={form.idcategoria}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.idcategoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  {categorias && categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value={1}>Categoría General</option>
                  )}
                </select>
                {errors.idcategoria && (
                  <p className="text-red-500 text-xs mt-1">{errors.idcategoria}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Categoría actual: {getCategoriaName(form.idcategoria)}
                </p>
              </div>
            </div>

            {/* Precio e inventario */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiDollarSign className="text-green-600" />
                Precio e Inventario
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Precio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio (S/) *
                  </label>
                  <input
                    type="number"
                    name="precio"
                    step="0.01"
                    min="0"
                    value={form.precio}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.precio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    disabled={loading}
                  />
                  {errors.precio && (
                    <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock en sucursal *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    disabled={loading}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={form.estado}
                    onChange={handleChange}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Producto activo
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    form.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {form.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Columna derecha - Imagen */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUpload className="text-blue-600" />
                Imagen del Producto
              </h3>

              {/* Upload de imagen */}
              <div className="mb-4">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  id="fileInput"
                  className="hidden"
                  disabled={loading || uploading}
                />

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                  {form.imagen ? (
                    <div className="space-y-4">
                      <img
                        src={form.imagen}
                        alt="Vista previa"
                        className="w-full h-80 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage();
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("fileInput").click()}
                        disabled={uploading || loading}
                        className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700"></div>
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <FiUpload className="h-4 w-4" />
                            Cambiar imagen
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="py-12">
                      <FiImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        No hay imagen seleccionada
                      </p>
                      <button
                        type="button"
                        onClick={() => document.getElementById("fileInput").click()}
                        disabled={uploading || loading}
                        className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <FiUpload className="h-4 w-4" />
                            Seleccionar imagen
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Actualizando...
              </>
            ) : (
              <>
                <FiSave className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;