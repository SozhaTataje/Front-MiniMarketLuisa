import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Image, FileText, Tag, Check, Store, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../../../api/axiosInstance';
import toast from 'react-hot-toast';

const CrearProductoModal = ({ isOpen, onClose, categorias: categoriasProps = [], sucursales: sucursalesProps = [], onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: '',
    estado: true,
    sucursal: '',
    stockInicial: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen]);

  const cargarDatos = async () => {
    setLoadingData(true);
    try {
      // Si ya tienes las props, úsalas, sino carga del backend
      if (categoriasProps && categoriasProps.length > 0) {
        setCategorias(categoriasProps);
      } else {
        const resCategorias = await api.get('/categoria/all');
        setCategorias(resCategorias.data || []);
      }

      if (sucursalesProps && sucursalesProps.length > 0) {
        setSucursales(sucursalesProps);
      } else {
        const resSucursales = await api.get('/sucursal/all');
        setSucursales(resSucursales.data || []);
      }

      console.log('Categorías cargadas:', categorias);
      console.log('Sucursales cargadas:', sucursales);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar categorías y sucursales');
      
      // Usar props como fallback
      setCategorias(categoriasProps || []);
      setSucursales(sucursalesProps || []);
    } finally {
      setLoadingData(false);
    }
  };

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
    
    if (!formData.imagen.trim()) {
      newErrors.imagen = 'La URL de la imagen es obligatoria';
    }
    
    if (!formData.categoria) {
      newErrors.categoria = 'Debe seleccionar una categoría';
    }

    // Validar URL de imagen
    try {
      new URL(formData.imagen);
    } catch {
      if (formData.imagen.trim()) {
        newErrors.imagen = 'Debe ser una URL válida';
      }
    }

    // Si se seleccionó sucursal, validar stock inicial
    if (formData.sucursal && (!formData.stockInicial || parseInt(formData.stockInicial) < 0)) {
      newErrors.stockInicial = 'El stock inicial debe ser mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      categoria: '',
      estado: true,
      sucursal: '',
      stockInicial: ''
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creando producto...');

    try {
      // 1. Crear el producto usando tu endpoint del backend
      const productoPayload = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        imagen: formData.imagen.trim(),
        idcategoria: parseInt(formData.categoria),
        estado: formData.estado
      };

      console.log('Creando producto:', productoPayload);
      
      const resProducto = await api.post('/producto/save', productoPayload);
      
      if (resProducto.status !== 200) {
        throw new Error('Error al crear el producto');
      }

      let mensajeExito = 'Producto creado exitosamente';

      // 2. Si se seleccionó una sucursal, asignar el producto
      if (formData.sucursal && formData.stockInicial !== '') {
        try {
          // Nota: Necesitarías obtener el ID del producto creado de la respuesta
          // Por ahora asumo que el backend devuelve el producto creado
          const productoCreado = resProducto.data;
          
          const asignacionPayload = {
            producto: productoCreado.idproducto || productoCreado.id, // Ajustar según tu backend
            sucursal: parseInt(formData.sucursal),
            stock: parseInt(formData.stockInicial || 0)
          };

          console.log('Asignando a sucursal:', asignacionPayload);
          
          const resAsignacion = await api.post('/productosucursal/agregar', asignacionPayload);
          
          if (resAsignacion.status === 200) {
            mensajeExito = `Producto creado y asignado a sucursal con ${formData.stockInicial} unidades`;
          }
        } catch (errorAsignacion) {
          console.error('Error al asignar a sucursal:', errorAsignacion);
          mensajeExito = 'Producto creado, pero no se pudo asignar a la sucursal';
          toast.warning('Producto creado, pero no se pudo asignar a la sucursal');
        }
      }

      toast.success(mensajeExito, { id: toastId });
      onSuccess(mensajeExito);
      resetForm();
      onClose();

    } catch (error) {
      console.error('Error completo:', error);
      
      let errorMessage = 'Error al crear el producto';
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data?.message || error.response.data || errorMessage;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor';
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl mx-4 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Producto</h2>
                <p className="text-sm text-gray-500">Completa la información del producto</p>
              </div>
            </div>
            
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Cargando categorías y sucursales...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nombre del Producto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Nombre del Producto *
              </label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Queso Fresco Artesanal"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe las características del producto..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none ${
                  errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Precio (S/) *
              </label>
              <input
                name="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.precio && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.precio}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.categoria ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Seleccionar categoría</option>
                {categorias && categorias.length > 0 ? (
                  categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay categorías disponibles</option>
                )}
              </select>
              {errors.categoria && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.categoria}
                </p>
              )}
            </div>

            {/* URL de Imagen */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-2" />
                URL de la Imagen *
              </label>
              <input
                name="imagen"
                type="url"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.imagen ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.imagen && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.imagen}
                </p>
              )}
            </div>

            {/* Estado del Producto */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    name="estado"
                    type="checkbox"
                    checked={formData.estado}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div className="ml-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Producto activo
                    </span>
                  </div>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 ml-8">
                Los productos activos aparecerán en el catálogo
              </p>
            </div>

            {/* Separador */}
            <div className="md:col-span-2">
              <hr className="border-gray-200" />
              <div className="flex items-center justify-center -mt-3">
                <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                  Asignación a Sucursal (Opcional)
                </span>
              </div>
            </div>

            {/* Sucursal Opcional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Store className="w-4 h-4 inline mr-2" />
                Asignar a Sucursal
              </label>
              <select
                name="sucursal"
                value={formData.sucursal}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                disabled={loading}
              >
                <option value="">No asignar por ahora</option>
                {sucursales && sucursales.length > 0 ? (
                  sucursales.map(sucursal => (
                    <option key={sucursal.idsucursal} value={sucursal.idsucursal}>
                      {sucursal.nombre} - {sucursal.ciudad}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay sucursales disponibles</option>
                )}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Puedes asignar el producto a sucursales más tarde
              </p>
            </div>

            {/* Stock Inicial - Solo aparece si se selecciona sucursal */}
            {formData.sucursal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Stock Inicial
                </label>
                <input
                  type="number"
                  min="0"
                  name="stockInicial"
                  value={formData.stockInicial}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.stockInicial ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.stockInicial && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.stockInicial}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Cantidad inicial de productos en esta sucursal
                </p>
              </div>
            )}
          </div>

            )}
          {formData.imagen && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Vista previa de la imagen:</p>
              <div className="flex justify-center">
                <img
                  src={formData.imagen}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="w-40 h-40 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-500 hidden"
                >
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">Error al cargar imagen</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Crear Producto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearProductoModal;