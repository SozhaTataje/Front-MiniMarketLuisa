import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Pencil, Save, CheckCircle } from "lucide-react";

const MisDatos = () => {
  const { usuario } = useAuth();
  const [editMode, setEditMode] = useState({
    nombre: false,
    apellido: false,
    telefono: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
    },
  });

  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        email: usuario.email,
      });
    }
  }, [usuario, reset]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/api/usuario/update/${usuario.idusuario}`, data);
      toast.success("Datos actualizados correctamente");
      setEditMode({ nombre: false, apellido: false, telefono: false });
    } catch {
      toast.error("Error al actualizar los datos");
    }
  };

  const isEditing = Object.values(editMode).some((v) => v);

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-purple-600 mb-8 text-center">
        Mis Datos Personales
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo: Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Nombre
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...register("nombre", { required: true })}
              disabled={!editMode.nombre}
              className={`w-full px-4 py-2 rounded-lg border ${
                editMode.nombre
                  ? "border-purple-500 bg-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setEditMode((prev) => ({ ...prev, nombre: !prev.nombre }))
              }
              className="text-purple-600 hover:text-purple-800"
              title="Editar nombre"
            >
              {editMode.nombre ? <CheckCircle size={20} /> : <Pencil size={20} />}
            </button>
          </div>
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
          )}
        </div>

        {/* Campo: Apellido */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Apellido
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...register("apellido", { required: true })}
              disabled={!editMode.apellido}
              className={`w-full px-4 py-2 rounded-lg border ${
                editMode.apellido
                  ? "border-purple-500 bg-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setEditMode((prev) => ({ ...prev, apellido: !prev.apellido }))
              }
              className="text-purple-600 hover:text-purple-800"
              title="Editar apellido"
            >
              {editMode.apellido ? <CheckCircle size={20} /> : <Pencil size={20} />}
            </button>
          </div>
          {errors.apellido && (
            <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
          )}
        </div>

        {/* Campo: Teléfono */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Teléfono
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...register("telefono", {
                required: true,
                pattern: /^[0-9]{9}$/,
              })}
              disabled={!editMode.telefono}
              className={`w-full px-4 py-2 rounded-lg border ${
                editMode.telefono
                  ? "border-purple-500 bg-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setEditMode((prev) => ({ ...prev, telefono: !prev.telefono }))
              }
              className="text-purple-600 hover:text-purple-800"
              title="Editar teléfono"
            >
              {editMode.telefono ? <CheckCircle size={20} /> : <Pencil size={20} />}
            </button>
          </div>
          {errors.telefono && (
            <p className="text-red-500 text-sm mt-1">
              {errors.telefono.type === "pattern"
                ? "Debe contener 9 dígitos."
                : "Este campo es obligatorio."}
            </p>
          )}
        </div>

        {/* Campo: Email solo lectura */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            {...register("email")}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300"
          />
        </div>

        {/* Botón guardar */}
        {isEditing && (
          <div className="text-center">
            <button
              type="submit"
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto transition"
            >
              <Save size={18} /> Guardar cambios
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MisDatos;
