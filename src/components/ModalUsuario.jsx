import React, { useState } from "react";
import { useForm } from "react-hook-form";

const ModalUsuario = ({ setShowUserForm, handleFinalizar, sucursal }) => {
  const { register, handleSubmit, formState: { errors }, watch,  } = useForm();

  const [tipoEntrega, setTipoEntrega] = useState("tienda");

  const onSubmit = (data) => {
    if (tipoEntrega === "tienda") {
      data.direccion = "RECOJO EN TIENDA";
    }
    setShowUserForm(false);
    handleFinalizar(data);
  };

  const fechaSeleccionada = watch("fechaEntrega");
  const horaSeleccionada = new Date(fechaSeleccionada || "").getHours();
  const horaInvalida = horaSeleccionada < 9 || horaSeleccionada >= 22;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl animate-fadeIn">
        <h2 className="text-xl font-bold text-purple-700 mb-6 text-center">
          Datos del Pedido
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="text-sm text-gray-600 mb-4">
            Sucursal del pedido:{" "}
            <span className="font-semibold text-purple-700">
              {sucursal?.nombre}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setTipoEntrega("domicilio")}
              className={`py-3 rounded-xl border font-medium transition-all ${
                tipoEntrega === "domicilio"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
              }`}
            >
              Entrega a domicilio
            </button>
            <button
              type="button"
              onClick={() => setTipoEntrega("tienda")}
              className={`py-3 rounded-xl border font-medium transition-all ${
                tipoEntrega === "tienda"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
              }`}
            >
              Recoger en tienda
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Nombre"
                className={`w-full border px-4 py-3 rounded-xl ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                {...register("nombre", { required: true })}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500 mt-1">
                  El nombre es obligatorio.
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Apellido"
                className={`w-full border px-4 py-3 rounded-xl ${
                  errors.apellido ? "border-red-500" : "border-gray-300"
                }`}
                {...register("apellido", { required: true })}
              />
              {errors.apellido && (
                <p className="text-sm text-red-500 mt-1">
                  El apellido es obligatorio.
                </p>
              )}
            </div>
          </div>

          {tipoEntrega === "domicilio" && (
            <div>
              <input
                type="text"
                placeholder="Dirección"
                className={`w-full border px-4 py-3 rounded-xl ${
                  errors.direccion ? "border-red-500" : "border-gray-300"
                }`}
                {...register("direccion", { required: true })}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500 mt-1">
                  La dirección es obligatoria.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="tel"
                placeholder="Teléfono (9 dígitos)"
                className={`w-full border px-4 py-3 rounded-xl ${
                  errors.telefono ? "border-red-500" : "border-gray-300"
                }`}
                {...register("telefono", {
                  required: true,
                  pattern: {
                    value: /^\d{9}$/,
                    message: "Debe tener exactamente 9 dígitos.",
                  },
                })}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.telefono.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                className={`w-full border px-4 py-3 rounded-xl ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo no válido.",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <input
              type="datetime-local"
              className={`w-full border px-4 py-3 rounded-xl ${
                errors.fechaEntrega || (fechaSeleccionada && horaInvalida)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...register("fechaEntrega", {
                required: true,
                validate: (value) => {
                  const date = new Date(value);
                  const now = new Date();
                  const selectedHour = date.getHours();

                  const maxDate = new Date();
                  maxDate.setDate(now.getDate() + 5);

                  return (
                    date > now &&
                    date <= maxDate &&
                    selectedHour >= 9 &&
                    selectedHour < 22
                  );
                },
              })}
              min={new Date().toISOString().slice(0, 16)}
              max={
                new Date(new Date().setDate(new Date().getDate() + 5))
                  .toISOString()
                  .split("T")[0] + "T22:00"
              }
            />
            {(errors.fechaEntrega || (fechaSeleccionada && horaInvalida)) && (
              <p className="text-sm text-red-500 mt-1">
                Selecciona una hora entre 9:00 a.m. y 10:00 p.m. dentro de los
                próximos 5 días.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Puedes elegir fecha de hoy hasta dentro de 5 días. Horario
              disponible: 09:00 - 22:00.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowUserForm(false)}
              className="py-2 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold"
              disabled={horaInvalida}
            >
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;
