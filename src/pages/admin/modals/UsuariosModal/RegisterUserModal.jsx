import React, { useState } from "react";
import Modal from "react-modal";
import api from "../../../../api/axiosInstance";

Modal.setAppElement("#root");

const RegisterUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    rol: "USER",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await api.post("/api/usuario/signup", form);
      alert("✅ Usuario registrado exitosamente");

      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        rol: "USER",
      });

      onClose();
      if (onUserAdded) onUserAdded();
    } catch (error) {
      alert("❌ Error al registrar usuario");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
    >
      <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Registrar Usuario</h2>

      <div className="space-y-4">
        <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
        <Input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" />
        <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
        <Input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" type="password" />
        <Input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />

        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Registrar
        </button>
      </div>
    </Modal>
  );
};

// Reutilizable
const Input = ({ name, value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
  />
);

export default RegisterUserModal;
