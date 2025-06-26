import React, { useState, useEffect } from 'react';
import { X, Save, Image, Package, DollarSign, FileText, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../../../api/axiosInstance';
import toast from 'react-hot-toast';

const EditarProductoModal = ({ isOpen, onClose, producto, categorias = [], onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: '',
    estado: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio?.toString() || '',
        imagen: producto.imagen || '',
        categoria: producto.categoria?.id?.toString() || '',
        estado: producto.estado !== undefined ? producto.estado : true
      });
      setImagePreview(producto.imagen || '');
    }
  }, [producto]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría';
    }
    
    if (formData.imagen && formData.imagen.trim()) {
      try {
        new URL(formData.imagen);
      } catch {
        newErrors.imagen = 'URL de imagen inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Actualizar preview de imagen
    if (name === 'imagen') {
      setImagePreview(value);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Actualizando producto...');

    try {
      const updateData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        imagen: formData.imagen.trim() || null,
        idcategoria: parseInt(formData.categoria),
        estado: formData.estado
      };

      await api.put(`/producto/update/${producto.idproducto}`, updateData);
      
      toast.success('Producto actualizado exitosamente', { id: toastId });
      onSuccess && onSuccess('Producto actualizado correctamente');
      onClose();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar el producto', { id: toastId });
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Editar Producto</h2>
              <p className="text-white/80 text-sm">Modifica la información del producto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-2 transition-all duration-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Vista previa de imagen */}
          {imagePreview && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-xl border-4 border-gray-100 shadow-md"
                  onError={() => setImagePreview('')}
                />
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1">
                  <Image className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nombre del producto */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 text-gray-500" />
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Queso Fresco Artesanal"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.nombre && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.nombre}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Describe las características del producto..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none ${
                  errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.descripcion && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.descripcion}
                </div>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Precio (S/) *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.precio && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.precio}
                </div>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  errors.categoria ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.categoria}
                </div>
              )}
            </div>

            {/* URL de imagen */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Image className="h-4 w-4 text-gray-500" />
                URL de la Imagen
              </label>
              <input
                type="url"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  errors.imagen ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.imagen && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.imagen}
                </div>
              )}
            </div>

            {/* Estado del producto */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="estado"
                  checked={formData.estado}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                  disabled={loading}
                />
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Producto activo</span>
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-8">
                Los productos inactivos no aparecerán en el catálogo público
              </p>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            * Campos obligatorios
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProductoModal;