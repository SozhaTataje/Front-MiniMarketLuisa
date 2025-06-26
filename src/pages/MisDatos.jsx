import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Pencil, Save, CheckCircle, User, Mail, Phone } from "lucide-react";

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
    <div className="max-w-2xl mx-auto py-10 px-6">
      <div className="bg-white rounded-xl shadow-lg ">

        <div className="bg-purple-600 text-white px-6 py-4 rounded-t-xl">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Mis Datos Personales
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Nombre</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  {...register("nombre", { required: "El nombre es obligatorio" })}
                  disabled={!editando.nombre}
                  className={`w-full px-4 py-3 pl-10 rounded-lg border transition ${
                    editando.nombre 
                      ? "bg-white border-purple-500 focus:border-purple-600" 
                      : "bg-gray-100 border-gray-300"
                  } focus:outline-none`}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <button
                type="button"
                onClick={() => setEditando({ ...editando, nombre: !editando.nombre })}
                className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition"
              >
                {editando.nombre ? <CheckCircle size={20} /> : <Pencil size={20} />}
              </button>
            </div>
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Apellido</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  {...register("apellido", { required: "El apellido es obligatorio" })}
                  disabled={!editando.apellido}
                  className={`w-full px-4 py-3 pl-10 rounded-lg border transition ${
                    editando.apellido 
                      ? "bg-white border-purple-500 focus:border-purple-600" 
                      : "bg-gray-100 border-gray-300"
                  } focus:outline-none`}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <button
                type="button"
                onClick={() => setEditando({ ...editando, apellido: !editando.apellido })}
                className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition"
              >
                {editando.apellido ? <CheckCircle size={20} /> : <Pencil size={20} />}
              </button>
            </div>
            {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Teléfono</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^[0-9]{9}$/,
                      message: "Debe tener 9 dígitos"
                    }
                  })}
                  disabled={!editando.telefono}
                  className={`w-full px-4 py-3 pl-10 rounded-lg border transition ${
                    editando.telefono 
                      ? "bg-white border-purple-500 focus:border-purple-600" 
                      : "bg-gray-100 border-gray-300"
                  } focus:outline-none`}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <button
                type="button"
                onClick={() => setEditando({ ...editando, telefono: !editando.telefono })}
                className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-lg transition"
              >
                {editando.telefono ? <CheckCircle size={20} /> : <Pencil size={20} />}
              </button>
            </div>
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Correo electrónico</label>
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                disabled
                className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-100 border border-gray-300 text-gray-600"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          {estaEditando && (
            <div className="pt-4">
              <button
                onClick={handleSubmit(onSubmit)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition w-full justify-center"
              >
                <Save size={18} />
                Guardar cambios
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisDatos;