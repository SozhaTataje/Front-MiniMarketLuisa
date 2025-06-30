import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiTag } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api/axiosInstance";
import AddCategoriaModal from "./modals/CategoriasModal/AddCategoriaModal";
import EditCategoriaModal from "./modals/CategoriasModal/EditCategoriaModal";
import DeleteCategoriaModal from "./modals/CategoriasModal/DeleteCategoriaModal";

const Categorias = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categoria/all");
      if (!Array.isArray(response.data)) throw new Error("La respuesta no es una lista");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error("No se pudieron cargar las categorías.");
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategory(categoria);
    setShowEditModal(true);
  };

  const handleDelete = (categoria) => {
    setCategoriaToDelete(categoria);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setEditingCategory(null);
    setCategoriaToDelete(null);
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Categorías</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Total: {categorias.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FiTag className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{categoria.name}</h3>
                <p className="text-sm text-gray-500">ID: {categoria.id}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(categoria)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FiEdit2 />
                Editar
              </button>
              <button
                onClick={() => handleDelete(categoria)}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="text-center py-12">
          <FiTag className="mx-auto text-gray-400 text-6xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay categorías registradas
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza creando tu primera categoría de productos
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <FiPlus />
            Nueva Categoría
          </button>
        </div>
      )}

      <AddCategoriaModal
        isOpen={showAddModal}
        onClose={handleCloseModals}
        onCreated={fetchCategorias}
      />

      <EditCategoriaModal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        categoria={editingCategory}
        onUpdated={fetchCategorias}
      />

      <DeleteCategoriaModal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        categoria={categoriaToDelete}
        onDeleted={fetchCategorias}
      />
    </div>
  );
};

export default Categorias;
