import React, { useEffect, useState } from "react";
import {
  FiX, FiPlus, FiCheck, FiMapPin, FiAlertCircle, FiPackage,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../../../api/axiosInstance";
import uploadImageToCloudinary from "../../../../utils/uploadImageToCloudinary";

const AddProductModal = ({ isOpen, onClose, onProductAdded, categorias = [], sucursales = [] }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdProductId, setCreatedProductId] = useState(null);
  const [selectedSucursales, setSelectedSucursales] = useState([]);
  const [stockBySucursal, setStockBySucursal] = useState({});

  const {register,handleSubmit,watch,setValue,reset,formState: { errors },} = useForm({
     defaultValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      estado: true,
      idcategoria: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ nombre: '',descripcion: '',precio: '',imagen: '',estado: true,idcategoria: categorias[0]?.id || '',});
      setCurrentStep(1);
      setCreatedProductId(null);
      setSelectedSucursales([]);
      setStockBySucursal({});
    }
  }, [isOpen, categorias, reset]);

  const handleCreateProduct = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        nombre: data.nombre.trim(),
        descripcion: data.descripcion.trim(),
        precio: parseFloat(data.precio),
        imagen: data.imagen.trim(),
        estado: data.estado === "true" || data.estado === true,
        idcategoria: parseInt(data.idcategoria),
      };

      const response = await api.post('/producto/save', payload);
      if (response.status === 200) {
        const { data: allProducts } = await api.get('/producto/all');
        const nuevoProducto = allProducts
          .filter(p => p.nombre === data.nombre && Math.abs(p.precio - payload.precio) < 0.01)
          .sort((a, b) => b.idproducto - a.idproducto)[0];

        if (nuevoProducto) {
          setCreatedProductId(nuevoProducto.idproducto);
          setCurrentStep(2);
          toast.success("Producto creado exitosamente");
        } else {
          toast("Producto creado, pero no se pudo identificar su ID");
          onProductAdded();
          onClose();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToSucursales = async () => {
    if (selectedSucursales.length === 0) {
      toast.error("Debe seleccionar al menos una sucursal");
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        selectedSucursales.map((id) =>
          api.post("/productosucursal/agregar", {
            producto: createdProductId,
            sucursal: id,
            stock: stockBySucursal[id] || 0,
          })
        )
      );
      toast.success("Producto asignado correctamente");
      onProductAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data || "Error al asignar sucursales");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipSucursales = () => {
    toast("Producto creado sin asignar sucursales");
    onProductAdded();
    onClose();
  };

  const handleSucursalToggle = (id) => {
    setSelectedSucursales(prev => {
      const updated = prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id];
      setStockBySucursal(prevStock => {
        const newStock = { ...prevStock };
        if (updated.includes(id)) newStock[id] = newStock[id] || 0;
        else delete newStock[id];
        return newStock;
      });
      return updated;
    });
  };

  const handleStockChange = (id, stock) => {
    setStockBySucursal(prev => ({ ...prev, [id]: Math.max(0, parseInt(stock) || 0) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setValue("imagen", imageUrl);
      toast.success("Imagen subida correctamente");
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FiPackage className="text-purple-600 text-xl" />
            <div>
              <h2 className="text-xl font-bold">
                {currentStep === 1 ? "Crear Producto" : "Asignar a Sucursales"}
              </h2>
              <p className="text-sm text-gray-500">
                {currentStep === 1
                  ? "Paso 1: Complete los datos del producto"
                  : "Paso 2: Asigne el producto a una o más sucursales"}
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading}>
            <FiX className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          {currentStep === 1 ? (
            <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-center gap-2">
                <FiAlertCircle className="text-blue-600" />
                <p className="text-sm text-blue-800">Luego de crear el producto, lo asignarás a sucursales.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium text-sm">Nombre *</label>
                  <input
                    {...register("nombre", { required: "El nombre es requerido" })}
                    className={`w-full border px-4 py-2 rounded ${errors.nombre ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className="font-medium text-sm">Precio (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precio", {
                      required: "Precio obligatorio",
                      min: { value: 0.01, message: "Debe ser mayor a 0" },
                    })}
                    className={`w-full border px-4 py-2 rounded ${errors.precio ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.precio && <p className="text-red-500 text-sm">{errors.precio.message}</p>}
                </div>
              </div>

              <div>
                <label className="font-medium text-sm">Descripción *</label>
                <textarea
                  rows={3}
                  {...register("descripcion", { required: "La descripción es obligatoria" })}
                  className={`w-full border px-4 py-2 rounded ${errors.descripcion ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium text-sm">Categoría *</label>
                  <select
                    {...register("idcategoria", { required: "Debe seleccionar una categoría" })}
                    className={`w-full border px-4 py-2 rounded ${errors.idcategoria ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.idcategoria && <p className="text-red-500 text-sm">{errors.idcategoria.message}</p>}
                </div>
                <div>
                  <label className="font-medium text-sm">Estado</label>
                  <select {...register("estado")} className="w-full border px-4 py-2 rounded border-gray-300">
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-sm">Imagen del producto *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
                {errors.imagen && <p className="text-red-500 text-sm">{errors.imagen.message}</p>}
                {watch("imagen") && (
                  <div className="mt-2">
                    <img src={watch("imagen")} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Crear Producto
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiMapPin /> Seleccionar Sucursales
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sucursales.map((s) => {
                  const isSelected = selectedSucursales.includes(s.idsucursal);
                  return (
                    <div
                      key={s.idsucursal}
                      onClick={() => handleSucursalToggle(s.idsucursal)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}
                    >
                      <h4 className="font-semibold">{s.nombre}</h4>
                      <p className="text-sm text-gray-500">{s.ciudad}</p>
                      {isSelected && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium">Stock inicial</label>
                          <input
                            type="number"
                            min={0}
                            value={stockBySucursal[s.idsucursal] || 0}
                            onChange={(e) => handleStockChange(s.idsucursal, e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={handleSkipSucursales}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  Omitir
                </button>
                <button
                  onClick={handleAssignToSucursales}
                  disabled={loading || selectedSucursales.length === 0}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Asignar Sucursales
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
