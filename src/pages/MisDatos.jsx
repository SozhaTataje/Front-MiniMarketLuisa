import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Pencil, Save, CheckCircle } from "lucide-react";

const MisDatos = () => {
  const { usuario } = useAuth();
  const [editando, setEditando] = useState({
    nombre: false,
    apellido: false,
    telefono: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (usuario) {
      setValue("nombre", usuario.nombre || "");
      setValue("apellido", usuario.apellido || "");
      setValue("telefono", usuario.telefono || "");
      setValue("email", usuario.email || "");
    }
  }, [usuario, setValue]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/api/usuario/update/${usuario.idusuario}`, data);
      toast.success("Datos actualizados correctamente");
      setEditando({ nombre: false, apellido: false, telefono: false });
    } catch  {
      toast.error("Error al actualizar los datos");
    }
  };

  const estaEditando = Object.values(editando).some((e) => e);

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-purple-600 text-center mb-8">Mis Datos Personales</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Nombre</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...register("nombre", { required: true })}
              disabled={!editando.nombre}
              className={`w-full px-4 py-2 rounded-lg border transition ${
                editando.nombre ? "bg-white border-purple-500" : "bg-gray-100 border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setEditando({ ...editando, nombre: !editando.nombre })}
              className="text-purple-600 hover:text-purple-800"
              title="Editar nombre"
            >
              {editando.nombre ? <CheckCircle size={20} /> : <Pencil size={20} />}
            </button>
          </div>
          {errors.nombre && <p className="text-red-500 text-sm">Este campo es obligatorio</p>}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Apellido</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...register("apellido", { required: true })}
              disabled={!editando.apellido}
              className={`w-full px-4 py-2 rounded-lg border transition ${
                editando.apellido ? "bg-white border-purple-500" : "bg-gray-100 border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setEditando({ ...editando, apellido: !editando.apellido })}
              className="text-purple-600 hover:text-purple-800"
              title="Editar apellido"
            >
              {editando.apellido ? <CheckCircle size={20} /> : <Pencil size={20} />}
            </button>
          </div>
          {errors.apellido && <p className="text-red-500 text-sm">Este campo es obligatorio</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Teléfono</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...register("telefono", {
                required: true,
                pattern: /^[0-9]{9}$/,
              })}
              disabled={!editando.telefono}
              className={`w-full px-4 py-2 rounded-lg border transition ${
                editando.telefono ? "bg-white border-purple-500" : "bg-gray-100 border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setEditando({ ...editando, telefono: !editando.telefono })}
              className="text-purple-600 hover:text-purple-800"
              title="Editar teléfono"
            >
              {editando.telefono ? <CheckCircle size={20} /> : <Pencil size={20} />}
            </button>
          </div>
          {errors.telefono && (
            <p className="text-red-500 text-sm">
              {errors.telefono.type === "pattern"
                ? "Debe tener 9 dígitos."
                : "Este campo es obligatorio"}
            </p>
          )}
        </div>

        {/* Email (solo lectura) */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Correo electrónico</label>
          <input
            type="email"
            {...register("email")}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300"
          />
        </div>

        {/* Botón Guardar */}
        {estaEditando && (
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Save size={18} />
              Guardar cambios
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MisDatos;
