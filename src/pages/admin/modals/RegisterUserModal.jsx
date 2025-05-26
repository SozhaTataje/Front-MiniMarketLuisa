
import React, { useState } from "react";
import Modal from "react-modal";
import api from "../../../api/axiosInstance";

Modal.setAppElement("#root");

const RegisterUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleRegister = async () => {
    try {
      await api.post("/api/usuario/signup", form);
      alert("Usuario registrado exitosamente");

      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
      });

      onClose(); 
      if (onUserAdded) onUserAdded(); 
    } catch (error) {
      alert("Error al registrar usuario");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 bg-white rounded shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>

      <input
        className="w-full mb-2 p-2 border"
        placeholder="Nombre"
        name="nombre"
        onChange={handleChange}
        value={form.nombre}
      />
      <input
        className="w-full mb-2 p-2 border"
        placeholder="Apellido"
        name="apellido"
        onChange={handleChange}
        value={form.apellido}
      />
      <input
        className="w-full mb-2 p-2 border"
        placeholder="Email"
        name="email"
        type="email"
        onChange={handleChange}
        value={form.email}
      />
      <input
        className="w-full mb-2 p-2 border"
        placeholder="Contraseña"
        name="password"
        type="password"
        onChange={handleChange}
        value={form.password}
      />
      <input
        className="w-full mb-2 p-2 border"
        placeholder="Teléfono"
        name="telefono"
        onChange={handleChange}
        value={form.telefono}
      />

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
        <button
          onClick={handleRegister}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Registrar
        </button>
      </div>
    </Modal>
  );
};

export default RegisterUserModal;
