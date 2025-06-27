import React, { useEffect, useCallback } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../../../api/axiosInstance";
import uploadImageToCloudinary from "../../../../utils/uploadImageToCloudinary";
import {
  FiUpload,
  FiX,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiMapPin,
  FiSave,
  FiImage,
} from "react-icons/fi";

const EditProductModal = ({
  isOpen,
  onClose,
  producto,
  onProductUpdated,
  categorias,
  sucursales,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      estado: true,
      idcategoria: 1,
      stock: "",
    },
  });

  const loadFormData = useCallback(() => {
    if (producto) {
      const prod = producto.producto || producto;
      const stock = producto.stock ?? 0;
      const idProductoSucursal = producto.idProductoSucursal ?? null;

      const categoriaId =
        prod?.categoria?.id || prod?.idcategoria || categorias[0]?.id || 1;

      reset({
        nombre: prod.nombre || "",
        descripcion: prod.descripcion || "",
        precio: prod.precio?.toString() || "",
        imagen: prod.imagen || "",
        estado: prod.estado ?? true,
        idcategoria: categoriaId,
        stock: stock.toString(),
      });

      setValue("idProductoSucursal", idProductoSucursal);
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

    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5MB");
      return;
    }

    toast.promise(
      uploadImageToCloudinary(file).then((url) => {
        setValue("imagen", url);
      }),
      {
        loading: "Subiendo imagen...",
        success: "Imagen subida correctamente",
        error: "Error al subir la imagen",
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
    const sucursal = sucursales?.find((s) => s.idsucursal === idSucursal);
    return sucursal
      ? `${sucursal.nombre} - ${sucursal.ciudad}`
      : "Sucursal desconocida";
  };

  if (!isOpen || !producto) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!isSubmitting ? onClose : undefined}
      ariaHideApp={false}
      className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-auto mt-15 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
    >
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FiPackage className="text-purple-600" size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Editar Producto
          </h2>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <FiX size={24} />
        </button>
      </div>
      <div className="mb-6 bg-purple-50 rounded-xl p-4">
        <div className="flex items-center gap-2 text-purple-700">
          <FiMapPin size={16} />
          <span className="font-medium">Sucursal: {getSucursalName()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiTag className="inline mr-2" size={16} />
                Nombre del producto *
              </label>
              <input
                type="text"
                {...register("nombre", { required: "Nombre requerido" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Ingresa el nombre del producto"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows="4"
                {...register("descripcion")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe el producto..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                {...register("idcategoria", {
                  required: "Selecciona una categoría",
                })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {categorias?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.idcategoria && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.idcategoria.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-1" size={16} />
                  Precio (S/) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("precio", {
                    required: "Precio requerido",
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
                {errors.precio && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.precio.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  {...register("stock", {
                    required: "Stock requerido",
                    min: { value: 0, message: "No puede ser negativo" },
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <input
                type="checkbox"
                {...register("estado")}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Producto activo
              </label>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiImage className="inline mr-2" size={16} />
                Imagen del producto
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FiUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Selecciona una imagen</p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG hasta 5MB
                  </p>
                </label>
              </div>
            </div>
            {(producto?.producto?.imagen || producto?.imagen) && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Vista previa
                </p>
                <img
                  src={producto?.producto?.imagen || producto?.imagen}
                  alt="Imagen del producto"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            disabled={isSubmitting}
          >
            <FiSave size={16} />
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
