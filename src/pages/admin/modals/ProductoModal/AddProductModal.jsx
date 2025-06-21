import React, { useState, useEffect } from 'react';
import {
  FiX, FiPlus, FiPackage, FiCheck, FiMapPin, FiAlertCircle
} from 'react-icons/fi';
import api from '../../../../api/axiosInstance';
import uploadImageToCloudinary from "../../../../utils/uploadImageToCloudinary";

const AddProductModal = ({ isOpen, onClose, onProductAdded, categorias = [], sucursales = [] }) => {
  const [productData, setProductData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    estado: true,
    idcategoria: ''
  });

  const [selectedSucursales, setSelectedSucursales] = useState([]);
  const [stockBySucursal, setStockBySucursal] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdProductId, setCreatedProductId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setProductData({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        estado: true,
        idcategoria: categorias[0]?.id || ''
      });
      setSelectedSucursales([]);
      setStockBySucursal({});
      setCurrentStep(1);
      setErrors({});
      setCreatedProductId(null);
    }
  }, [isOpen, categorias]);

  const handleProductChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateProductData = () => {
    const newErrors = {};
    if (!productData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!productData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!productData.precio || productData.precio <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!productData.imagen.trim()) newErrors.imagen = 'La imagen es requerida';
    if (!productData.idcategoria) newErrors.idcategoria = 'Debe seleccionar una categoría';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProduct = async () => {
    if (!validateProductData()) return;
    setLoading(true);
    try {
      const payload = {
        ...productData,
        nombre: productData.nombre.trim(),
        descripcion: productData.descripcion.trim(),
        precio: parseFloat(productData.precio),
        imagen: productData.imagen.trim(),
        idcategoria: parseInt(productData.idcategoria)
      };
      const response = await api.post('/producto/save', payload);
      if (response.status === 200) {
        const { data } = await api.get('/producto/all');
        const nuevoProducto = data
          .filter(p => p.nombre === productData.nombre && Math.abs(p.precio - payload.precio) < 0.01)
          .sort((a, b) => b.idproducto - a.idproducto)[0];
        if (nuevoProducto) {
          setCreatedProductId(nuevoProducto.idproducto);
          setCurrentStep(2);
        } else {
          alert('Producto creado, pero no se encontró el ID.');
          onProductAdded();
          onClose();
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Error al crear el producto';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSucursalToggle = (id) => {
    setSelectedSucursales(prev => {
      const nuevo = prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id];
      setStockBySucursal(stock => {
        const copy = { ...stock };
        if (nuevo.includes(id)) copy[id] = copy[id] || 0;
        else delete copy[id];
        return copy;
      });
      return nuevo;
    });
  };

  const handleStockChange = (id, stock) => {
    setStockBySucursal(prev => ({ ...prev, [id]: Math.max(0, parseInt(stock) || 0) }));
  };

  const handleAssignToSucursales = async () => {
    if (selectedSucursales.length === 0) return alert('Debe seleccionar al menos una sucursal');
    setLoading(true);
    try {
      await Promise.all(
        selectedSucursales.map(id =>
          api.post('/productosucursal/agregar', {
            producto: createdProductId,
            sucursal: id,
            stock: stockBySucursal[id] || 0
          })
        )
      );
      alert('Producto asignado correctamente');
      onProductAdded();
      onClose();
    } catch (err) {
      alert(err.response?.data || 'Error al asignar a sucursales');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipSucursales = () => {
    alert('Producto creado sin asignar a sucursales');
    onProductAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FiPackage className="text-purple-600 text-2xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStep === 1 ? 'Crear Nuevo Producto' : 'Asignar a Sucursales'}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStep === 1
                  ? 'Paso 1: Información del producto'
                  : 'Paso 2: Seleccionar sucursales y stock inicial'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'
              }`}>1</div>
              <span className="font-medium">Crear Producto</span>
            </div>
            <div className={`h-px bg-gray-300 flex-1 ${currentStep >= 2 ? 'bg-purple-600' : ''}`}></div>
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'
              }`}>2</div>
              <span className="font-medium">Asignar Sucursales</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <FiAlertCircle className="text-blue-600" />
                <p className="text-sm text-blue-800">El producto se crea primero, luego se asigna a sucursales con stock.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                  <input
                    type="text"
                    value={productData.nombre}
                    onChange={(e) => handleProductChange('nombre', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ej: Queso Fresco Artesanal"
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.precio}
                    onChange={(e) => handleProductChange('precio', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${errors.precio ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="15.50"
                  />
                  {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  value={productData.descripcion}
                  onChange={(e) => handleProductChange('descripcion', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describe las características del producto..."
                />
                {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                  <select
                    value={productData.idcategoria}
                    onChange={(e) => handleProductChange('idcategoria', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${errors.idcategoria ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.idcategoria && <p className="text-red-500 text-sm mt-1">{errors.idcategoria}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={productData.estado}
                    onChange={(e) => handleProductChange('estado', e.target.value === 'true')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setLoading(true);
                    try {
                      const imageUrl = await uploadImageToCloudinary(file);
                      handleProductChange("imagen", imageUrl);
                    } catch {
                      alert("Error al subir la imagen a Cloudinary");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                {errors.imagen && <p className="text-red-500 text-sm mt-1">{errors.imagen}</p>}
                {productData.imagen && (
                  <div className="mt-2">
                    <img src={productData.imagen} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheck className="text-green-600" />
                  <h3 className="font-medium text-green-800">Producto creado exitosamente</h3>
                </div>
                <div className="text-sm text-green-700">
                  <p><strong>Nombre:</strong> {productData.nombre}</p>
                  <p><strong>Precio:</strong> S/ {parseFloat(productData.precio).toFixed(2)}</p>
                  <p><strong>Categoría:</strong> {categorias.find(c => c.id === parseInt(productData.idcategoria))?.name || 'No especificada'}</p>
                  <p><strong>ID del Producto:</strong> {createdProductId}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                <FiAlertCircle className="text-amber-600" />
                <p className="text-sm text-amber-800">Para que el producto esté disponible para venta, debe asignarse a una sucursal con stock.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMapPin className="text-purple-600" />
                  Seleccionar Sucursales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sucursales.map(sucursal => {
                    const isSelected = selectedSucursales.includes(sucursal.idsucursal);
                    return (
                      <div
                        key={sucursal.idsucursal}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                        onClick={() => handleSucursalToggle(sucursal.idsucursal)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 transition-all ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                            {isSelected && <FiCheck className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{sucursal.nombre}</h4>
                            <p className="text-sm text-gray-600">{sucursal.ciudad}</p>
                            <p className="text-xs text-gray-500">{sucursal.direccion}</p>
                            {isSelected && (
                              <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock inicial:</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={stockBySucursal[sucursal.idsucursal] || 0}
                                  onChange={(e) => handleStockChange(sucursal.idsucursal, e.target.value)}
                                  className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  placeholder="0"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            {currentStep === 1 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateProduct}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-4 h-4" />
                      Crear Producto
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSkipSucursales}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={loading}
                >
                  Omitir Sucursales
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleAssignToSucursales}
                    disabled={loading || selectedSucursales.length === 0}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Asignando...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Asignar Sucursales
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
