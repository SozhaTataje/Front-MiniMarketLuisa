import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag, FiX, FiSave } from "react-icons/fi";
import api from "../../api/axiosInstance";

const Categorias = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "" });
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
      alert("No se pudieron cargar las categorías.");
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategorias = (categorias || []).filter((categoria) =>
    categoria?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory
        ? `/categoria/update/${editingCategory.id}`
        : "/categoria/save";

      const method = editingCategory ? api.put : api.post;

      const response = await method(url, formData);

      alert(response.data || "Operación exitosa");
      await fetchCategorias();
      resetForm();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      alert("Error al guardar la categoría");
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategory(categoria);
    setFormData({ name: categoria.name });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        const response = await api.delete(`/categoria`, {
          params: { idcategoria: id },
        });

        alert(response.data || "Categoría eliminada");
        await fetchCategorias();
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
        alert("Error al eliminar la categoría");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingCategory(null);
    setShowModal(false);
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
      {/* Encabezado y botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Categorías</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus />
          Nueva Categoría
        </button>
      </div>

      {/* Barra de búsqueda y estadísticas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categorías..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Total: {categorias.length}
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Con Productos: {categorias.filter((c) => c?.productos?.length > 0).length}
            </div>
            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Sin Productos: {categorias.filter((c) => !c?.productos || c.productos.length === 0).length}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategorias.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-purple-100">
                    <FiTag className="text-xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{categoria.name}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      ID: {categoria.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="text-xs text-gray-400">Categoría #{categoria.id}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(categoria)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FiEdit2 />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(categoria.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay categorías */}
      {filteredCategorias.length === 0 && (
        <div className="text-center py-12">
          <FiTag className="mx-auto text-gray-400 text-6xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No se encontraron categorías" : "No hay categorías registradas"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? "Intenta con un término de búsqueda diferente" : "Comienza creando tu primera categoría de productos"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <FiPlus />
              Nueva Categoría
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button onClick={resetForm} className="text-gray-600 hover:text-gray-800">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Lácteos, Carnes, Abarrotes..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <FiSave />
                  {editingCategory ? "Actualizar" : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;
