import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { X, Save, RefreshCw } from 'lucide-react';
import api from "../../../../api/axiosInstance";

const EditarProductoModal = ({ isOpen, onClose, producto, categorias, onProductoActualizado }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  // Cargar datos iniciales
  useEffect(() => {
    if (producto && isOpen) {
      setValue('nombre', producto.nombre || '');
      setValue('descripcion', producto.descripcion || '');
      setValue('precio', producto.precio?.toString() || '');
      setValue('imagen', producto.imagen || '');
      setValue('estado', producto.estado?.toString() || 'true');
      setValue('idcategoria', producto.categoria?.id?.toString() || '');
    }
  }, [producto, isOpen, setValue]);

  const imagenPreview = watch('imagen');

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

      await api.put(`/producto/update/${producto.idproducto}`, requestData);
      toast.success('Producto actualizado correctamente');
      onProductoActualizado();
      reset();
      onClose();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Editar Producto</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Info actual */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Producto actual:</h3>
            <p className="text-lg font-semibold">{producto.nombre}</p>
            <p className="text-sm text-gray-600">{producto.categoria?.name}</p>
          </div>

          {/* Nombre y categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre *</label>
              <input
                {...register('nombre', { required: true })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.nombre && <p className="text-red-500 text-sm">Campo requerido</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Categoría *</label>
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
            <label className="text-sm font-medium">Descripción *</label>
            <textarea
              rows={3}
              {...register('descripcion', { required: true })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.descripcion && <p className="text-red-500 text-sm">Campo requerido</p>}
          </div>

          {/* Precio y estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Precio (S/.) *</label>
              <input
                type="number"
                step="0.01"
                {...register('precio', { required: true })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.precio && <p className="text-red-500 text-sm">Campo requerido</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Estado</label>
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
            <label className="text-sm font-medium">URL de Imagen</label>
            <input
              type="url"
              {...register('imagen')}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />

            {/* Vista previa */}
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                <img
                  src={producto.imagen || 'https://via.placeholder.com/150?text=Sin+Imagen'}
                  alt="Imagen actual"
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen'; }}
                />
              </div>

              {imagenPreview && imagenPreview !== producto.imagen && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nueva imagen:</p>
                  <img
                    src={imagenPreview}
                    alt="Nueva imagen"
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end pt-6 border-t mt-6 space-x-4">
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
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProductoModal;
