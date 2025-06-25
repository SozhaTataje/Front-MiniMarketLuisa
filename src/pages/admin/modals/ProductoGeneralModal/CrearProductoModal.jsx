import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { X, Save, RefreshCw } from 'lucide-react';
import api from "../../../../api/axiosInstance";

const CrearProductoModal = ({ isOpen, onClose, categorias, onProductoCreado }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      estado: 'true',
      idcategoria: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const requestData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio),
        imagen: data.imagen,
        estado: data.estado === 'true',
        idcategoria: parseInt(data.idcategoria),
      };

      await api.post('/producto/save', requestData);
      toast.success('Producto creado exitosamente');
      onProductoCreado();
      reset();
      onClose();
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error('Error al crear el producto');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const imagenPreview = watch('imagen');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Producto</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Nombre y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                {...register('nombre', { required: true })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del producto"
              />
              {errors.nombre && <p className="text-red-500 text-sm">Este campo es requerido</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <select
                {...register('idcategoria', { required: true })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.idcategoria && <p className="text-red-500 text-sm">Campo requerido</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea
              {...register('descripcion', { required: true })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada"
            />
            {errors.descripcion && <p className="text-red-500 text-sm">Este campo es requerido</p>}
          </div>

          {/* Precio y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('precio', { required: true })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.precio && <p className="text-red-500 text-sm">Este campo es requerido</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                {...register('estado')}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
            <input
              type="url"
              {...register('imagen')}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Vista previa imagen */}
          {imagenPreview && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
              <img
                src={imagenPreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end pt-4 border-t mt-4 space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
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

export default CrearProductoModal;
