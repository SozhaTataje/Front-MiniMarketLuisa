import React, { useState, useRef, useCallback, useEffect } from "react";
import api from "../../../../api/axiosInstance";
import uploadImageToCloudinary from "../../../../utils/uploadImageToCloudinary";
import { FiUpload, FiX, FiPackage, FiDollarSign, FiTag, FiMapPin, FiImage, FiSave } from "react-icons/fi";

const AddProductModal = ({ isOpen, onClose, onProductAdded, idSucursal, categorias, sucursales }) => {
  // Estados del formulario
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    estado: true,
    idCategoria: 1,
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef();

  // Resetear formulario
  const resetForm = useCallback(() => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      estado: true,
      idCategoria: categorias && categorias.length > 0 ? categorias[0].id : 1,
      stock: "",
    });
    setErrors({});
  }, [categorias]);

  // Resetear cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!form.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!form.precio || parseFloat(form.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (form.stock === "" || parseInt(form.stock) < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (!form.idCategoria) {
      newErrors.idCategoria = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    setForm(prev => ({ ...prev, [name]: val }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Manejar subida de imagen
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño de archivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      if (imageUrl) {
        setForm(prev => ({ ...prev, imagen: imageUrl }));
        alert("Imagen subida correctamente");
      } else {
        alert("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Crear el producto general
      const productRequest = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: parseFloat(form.precio),
        imagen: form.imagen,
        estado: form.estado,
        idcategoria: parseInt(form.idCategoria),
      };

      console.log("Creando producto:", productRequest);
      const saveResponse = await api.post("/producto/save", productRequest);
      console.log("Producto creado:", saveResponse.data);

      // 2. Obtener el producto recién creado para conseguir su ID
      const allProductsResponse = await api.get("/producto/all");
      const productoCreado = allProductsResponse.data.find(
        (p) => p.nombre.trim().toLowerCase() === form.nombre.trim().toLowerCase() &&
               Math.abs(p.precio - parseFloat(form.precio)) < 0.01
      );

      if (!productoCreado) {
        throw new Error("No se pudo obtener el ID del producto creado");
      }

      console.log("Producto encontrado:", productoCreado);

      // 3. Agregar el producto a la sucursal con el stock
      const productoSucursalRequest = {
        producto: productoCreado.idproducto,
        sucursal: idSucursal,
        stock: parseInt(form.stock),
      };

      console.log("Agregando a sucursal:", productoSucursalRequest);
      const addToSucursalResponse = await api.post("/productosucursal/agregar", productoSucursalRequest);
      console.log("Agregado a sucursal:", addToSucursalResponse.data);

      alert("Producto creado y agregado a la sucursal correctamente");

      // 4. Limpiar formulario y cerrar modal
      resetForm();
      
      // 5. Notificar al componente padre
      if (onProductAdded) {
        onProductAdded();
      }
      
      // 6. Cerrar modal
      onClose();

    } catch (error) {
      console.error("Error al agregar producto:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          "Error desconocido al crear el producto";
      alert("Error al agregar producto: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre de sucursal
  const getSucursalName = () => {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
            <FiPackage className="text-xl" />
            Agregar Nuevo Producto
          </h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Información de sucursal */}
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <FiMapPin className="h-5 w-5" />
            <span className="font-semibold">Agregando a sucursal:</span>
            <span className="font-bold">{getSucursalName()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
                    placeholder="Ej: Queso fresco artesanal"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                  )}
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Describe las características del producto..."
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none ${
                      errors.descripcion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.descripcion && (
                    <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
                  )}
                </div>

                {/* Categoría */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="idCategoria"
                    value={form.idCategoria}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.idCategoria ? 'border-red-500' : 'border-gray-300'
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
                  {errors.idCategoria && (
                    <p className="text-red-500 text-xs mt-1">{errors.idCategoria}</p>
                  )}
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
                      placeholder="0.00"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.precio ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.precio && (
                      <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
                    )}
                  </div>

                  {/* Stock inicial */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock inicial *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      placeholder="0"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.stock ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                  <p className="text-xs text-gray-500 mt-1">
                    Los productos inactivos no se mostrarán en la tienda
                  </p>
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
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading || uploading}
                  />
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    {form.imagen ? (
                      <div className="space-y-4">
                        <img
                          src={form.imagen}
                          alt="Vista previa"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src = getPlaceholderImage();
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium flex items-center justify-center gap-2"
                          disabled={uploading || loading}
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
                      <div className="space-y-4">
                        <FiImage className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading || loading}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto ${
                              uploading || loading
                                ? "bg-purple-400 text-white cursor-not-allowed" 
                                : "bg-purple-600 text-white hover:bg-purple-700"
                            }`}
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
                          <p className="text-sm text-gray-500 mt-2">
                            Formatos: JPG, PNG, WebP (máx. 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-purple-600">Subiendo imagen...</span>
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">Resumen del Producto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium text-gray-900">{form.nombre || "Sin nombre"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <span className="font-medium text-gray-900">S/ {form.precio || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium text-gray-900">{form.stock || "0"} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${form.estado ? "text-green-600" : "text-red-600"}`}>
                      {form.estado ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <span className="font-medium text-gray-900">
                      {categorias?.find(c => c.id === parseInt(form.idCategoria))?.name || "Sin categoría"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={loading || uploading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploading || !form.nombre.trim() || !form.descripcion.trim() || !form.precio || !form.stock}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors flex items-center gap-2 ${
                loading || uploading || !form.nombre.trim() || !form.descripcion.trim() || !form.precio || !form.stock
                  ? "bg-purple-400 cursor-not-allowed" 
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4" />
                  Crear Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;