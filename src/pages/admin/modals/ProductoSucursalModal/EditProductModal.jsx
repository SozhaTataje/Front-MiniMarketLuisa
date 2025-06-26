import React, { useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../../../api/axiosInstance';
import uploadImageToCloudinary from '../../../../utils/uploadImageToCloudinary';
import {FiUpload, FiX, FiPackage, FiDollarSign, FiTag,FiMapPin, FiSave, FiImage} from 'react-icons/fi';

const EditProductModal = ({isOpen,onClose,producto,onProductUpdated,categorias,sucursales}) => {
  const {register,handleSubmit,reset,setValue,formState: { errors, isSubmitting }} = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      estado: true,
      idcategoria: 1,
      stock: '',
    }
  });

  const loadFormData = useCallback(() => {
    if (producto) {
      const prod = producto.producto || producto;
      const stock = producto.stock ?? 0;
      const idProductoSucursal = producto.idProductoSucursal ?? null;

      const categoriaId = prod?.categoria?.id || prod?.idcategoria || categorias[0]?.id || 1;

      reset({
        nombre: prod.nombre || '',
        descripcion: prod.descripcion || '',
        precio: prod.precio?.toString() || '',
        imagen: prod.imagen || '',
        estado: prod.estado ?? true,
        idcategoria: categoriaId,
        stock: stock.toString(),
      });

      setValue('idProductoSucursal', idProductoSucursal);
    }
  }, [producto, categorias, reset, setValue]);

  useEffect(() => {
    if (isOpen && producto) {
      loadFormData();
    }
  }, [isOpen, producto, loadFormData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Selecciona un archivo de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5MB");
      return;
    }

    toast.promise(
      uploadImageToCloudinary(file).then((url) => {
        setValue('imagen', url);
      }),
      {
        loading: 'Subiendo imagen...',
        success: 'Imagen subida correctamente',
        error: 'Error al subir la imagen',
      }
    );
  };

  const onSubmit = async (data) => {
    try {
      const idProducto = producto?.producto?.idproducto || producto?.idproducto;
      const idSucursal = producto?.sucursal?.idsucursal || producto?.idsucursal;

      if (!idProducto || !idSucursal) {
        throw new Error("IDs inválidos del producto o sucursal.");
      }

      await api.put(`/producto/update/${idProducto}`, {
        nombre: data.nombre.trim(),
        descripcion: data.descripcion.trim(),
        precio: parseFloat(data.precio),
        imagen: data.imagen || null,
        estado: data.estado,
        idcategoria: parseInt(data.idcategoria),
      });

      await api.put("/productosucursal/stock/actualizar", null, {
        params: {
          idProducto,
          idSucursal,
          stock: parseInt(data.stock),
        },
      });

      toast.success("Producto actualizado correctamente");
      onProductUpdated?.();
      onClose();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data || "Error al actualizar";
      toast.error(`${msg}`);
    }
  };

  const getSucursalName = () => {
    const idSucursal = producto?.sucursal?.idsucursal || producto?.idsucursal;
    const sucursal = sucursales?.find(s => s.idsucursal === idSucursal);
    return sucursal ? `${sucursal.nombre} - ${sucursal.ciudad}` : 'Sucursal desconocida';
  };

  if (!isOpen || !producto) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!isSubmitting ? onClose : undefined}
      ariaHideApp={false}
      className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-700">
          <FiPackage /> Editar Producto
        </h2>
        <button onClick={onClose} disabled={isSubmitting}>
          <FiX className="text-gray-500 hover:text-black" size={20} />
        </button>
      </div>

      <div className="mb-4 text-blue-600 flex items-center gap-2">
        <FiMapPin />
        <span><strong>Sucursal:</strong> {getSucursalName()}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <div>
          <label className="font-semibold">Nombre *</label>
          <input
            type="text"
            {...register("nombre", { required: "Nombre requerido" })}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="font-semibold">Descripción</label>
          <textarea
            rows="3"
            {...register("descripcion")}
            className="w-full p-2 border rounded mt-1"
          />
        </div>


        <div>
          <label className="font-semibold">Categoría *</label>
          <select
            {...register("idcategoria", { required: "Selecciona una categoría" })}
            className="w-full p-2 border rounded mt-1"
          >
            {categorias?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.idcategoria && <p className="text-red-500 text-sm">{errors.idcategoria.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Precio (S/)*</label>
            <input
              type="number"
              step="0.01"
              {...register("precio", {
                required: "Precio requerido",
                min: { value: 0.01, message: "Debe ser mayor a 0" },
              })}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.precio && <p className="text-red-500 text-sm">{errors.precio.message}</p>}
          </div>

          <div>
            <label className="font-semibold">Stock *</label>
            <input
              type="number"
              {...register("stock", {
                required: "Stock requerido",
                min: { value: 0, message: "No puede ser negativo" },
              })}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" {...register("estado")} />
          <label>Producto activo</label>
        </div>

        <div>
          <label className="font-semibold">Imagen</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />
        </div>

        <div className="my-2">
          <img
            src={producto?.producto?.imagen || producto?.imagen}
            alt="Imagen del producto"
            className="max-h-48 rounded border"
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
