    import React, { useState, useEffect } from "react";
import Modal from "react-modal";


const EditUserModal = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!user?.idusuario) {
      alert("Error: No se encontró el ID del usuario");
      return;
    }

    setLoading(true);
    try {
      alert("Funcionalidad de edición pendiente de implementar en el backend");
      onUserUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Editar Usuario
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Email: {user?.email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Nombre:
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Apellido:
          </label>
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Teléfono:
          </label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            pattern="[0-9]{9}"
            maxLength="9"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`flex-1 py-3 px-4 rounded-md font-semibold text-white transition-colors ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;