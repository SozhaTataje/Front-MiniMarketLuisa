import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../../../api/axiosInstance';
import toast from 'react-hot-toast';

const EditarProductoModal = ({ isOpen, onClose, producto, categorias, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: ''
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        imagen: producto.imagen || '',
        categoria: producto.categoria?.id || ''
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/producto/update/${producto.idproducto}`, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen: formData.imagen,
        idcategoria: formData.categoria
      });
      toast.success('Producto actualizado');
      onSuccess('Producto actualizado correctamente');
      onClose();
    } catch {
      toast.error('Error al actualizar producto');
    }
  };

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-600">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Editar Producto</h2>

        <div className="space-y-4">
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border rounded p-2"
          />
          <input
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border rounded p-2"
          />
          <input
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
            type="number"
            className="w-full border rounded p-2"
          />
          <input
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="URL de la imagen"
            className="w-full border rounded p-2"
          />
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarProductoModal;
