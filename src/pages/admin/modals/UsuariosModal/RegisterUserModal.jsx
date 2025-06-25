import React from "react";
import Modal from "react-modal";
import api from "../../../../api/axiosInstance";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

Modal.setAppElement("#root");

const RegisterUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const {register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      telefono: "",
      rol: "USER",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/api/usuario/signup", data);
      toast.success("Usuario registrado exitosamente");

      reset();
      onClose();
      if (onUserAdded) onUserAdded();
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
      >
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Registrar Usuario</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre"
            name="nombre"
            register={register}
            error={errors.nombre}
            validation={{ required: "Este campo es obligatorio" }}
          />
          <Input
            label="Apellido"
            name="apellido"
            register={register}
            error={errors.apellido}
            validation={{ required: "Este campo es obligatorio" }}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            validation={{
              required: "El email es obligatorio",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email inválido",
              },
            }}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            validation={{ required: "La contraseña es obligatoria" }}
          />
          <Input
            label="Teléfono"
            name="telefono"
            register={register}
            error={errors.telefono}
            validation={{ required: "Este campo es obligatorio" }}
          />

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Rol</label>
            <select
              {...register("rol")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md transition ${
                isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const Input = ({ label, name, type = "text", register, validation, error }) => (
  <div>
    <label className="block mb-1 font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      {...register(name, validation)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
    />
    {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
  </div>
);

export default RegisterUserModal;
