import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X, Plus, Image, Package, DollarSign, FileText, Tag,
  AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react';
import api from '../../../../api/axiosInstance';
import toast from 'react-hot-toast';
import uploadImageToCloudinary from '../../../../utils/uploadImageToCloudinary';

const CrearProductoModal = ({ isOpen, onClose, categorias = [], onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [categoriasInternas, setCategoriasInternas] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const {register,handleSubmit,reset,formState: { errors }} = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: null,
      categoria: '',
      estado: true
    }
  });

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      reset();
      setImagePreview('');
      setSelectedFile(null);
    }
  }, [isOpen]);

  const cargarDatos = async () => {
    setLoadingData(true);
    try {
      if (categorias.length > 0) {
        setCategoriasInternas(categorias);
      } else {
        const resCat = await api.get('/categoria/all');
        setCategoriasInternas(resCat.data || []);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    const toastId = toast.loading('Creando producto...');

    try {
      let imageUrl = '';

      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile);
        if (!imageUrl) throw new Error('Error al subir imagen');
      }

      const productoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        imagen: imageUrl || null,
        idcategoria: parseInt(formData.categoria),
        estado: formData.estado
      };

      await api.post('/producto/save', productoData);

      toast.success('Producto creado exitosamente', { id: toastId });
      onSuccess && onSuccess('Producto creado exitosamente');
      reset();
      onClose();
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error('Error al crear el producto', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out scale-100 max-h-[90vh]">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Crear Nuevo Producto</h2>
              <p className="text-white/80 text-sm">Añade un producto al catálogo</p>
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
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin mb-3" />
                <p>Cargando datos...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {imagePreview && (
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-32 h-32 object-cover rounded-xl border-4 border-gray-100 shadow-md"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                        <Image className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      {...register('nombre', { required: 'El nombre es obligatorio' })}
                      className={`w-full px-4 py-3 border rounded-xl ${
                        errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Queso Fresco Artesanal"
                      disabled={loading}
                    />
                    {errors.nombre && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.nombre.message}
                      </p>
                    )}
                  </div>

                 <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      Descripción *
                    </label>
                    <textarea
                      rows="3"
                      {...register('descripcion', { required: 'La descripción es obligatoria' })}
                      className={`w-full px-4 py-3 border rounded-xl resize-none ${
                        errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Describe las características del producto..."
                      disabled={loading}
                    />
                    {errors.descripcion && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.descripcion.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Precio (S/) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('precio', {
                        required: 'El precio es obligatorio',
                        min: { value: 0.01, message: 'Debe ser mayor a 0' }
                      })}
                      className={`w-full px-4 py-3 border rounded-xl ${
                        errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      disabled={loading}
                    />
                    {errors.precio && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.precio.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      Categoría *
                    </label>
                    <select
                      {...register('categoria', { required: 'Selecciona una categoría' })}
                      className={`w-full px-4 py-3 border rounded-xl ${
                        errors.categoria ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categoriasInternas.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.categoria && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.categoria.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Image className="h-4 w-4 text-gray-500" />
                      Imagen del producto *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full px-4 py-3 border rounded-xl border-gray-300"
                      disabled={loading}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('estado')}
                        className="w-5 h-5 text-blue-500 border-gray-300 rounded"
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

                <div className="px-0 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">* Campos obligatorios</div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || loadingData}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {loading ? 'Creando...' : 'Crear Producto'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearProductoModal;
