import React from "react";

const ModalUsuario = ({ userData, setUserData, errors, setErrors, setShowUserForm, validarCampos, handleFinalizar }) => {
  const inputClass = (campo) =>
    `w-full border px-4 py-3 rounded-xl transition-all ${
      errors[campo] ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-purple-500"
    }`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl animate-fadeIn">
        <h2 className="text-xl font-bold text-purple-700 mb-6 text-center">Datos del Pedido</h2>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {["nombre", "apellido"].map((campo) => (
            <div key={campo}>
              <input
                type="text"
                placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                className={inputClass(campo)}
                value={userData[campo]}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserData((prev) => ({ ...prev, [campo]: value }));
                  setErrors((prev) => ({ ...prev, [campo]: !value.trim() }));
                }}
              />
              {errors[campo] && (
                <p className="text-sm text-red-500 mt-1">Este campo es obligatorio.</p>
              )}
            </div>
          ))}
        </div>

        {/* Dirección */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Dirección"
            className={inputClass("direccion")}
            value={userData.direccion}
            onChange={(e) => {
              const value = e.target.value;
              setUserData((prev) => ({ ...prev, direccion: value }));
              setErrors((prev) => ({ ...prev, direccion: !value.trim() }));
            }}
          />
          {errors.direccion && (
            <p className="text-sm text-red-500 mt-1">La dirección es obligatoria.</p>
          )}
        </div>

        {/* Teléfono y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="tel"
              placeholder="Teléfono (9 dígitos)"
              className={inputClass("telefono")}
              value={userData.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                setUserData((prev) => ({ ...prev, telefono: value }));
                setErrors((prev) => ({
                  ...prev,
                  telefono: !/^\d{9}$/.test(value),
                }));
              }}
            />
            {errors.telefono && (
              <p className="text-sm text-red-500 mt-1">Debe tener exactamente 9 dígitos.</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className={inputClass("email")}
              value={userData.email}
              onChange={(e) => {
                const value = e.target.value;
                setUserData((prev) => ({ ...prev, email: value }));
                setErrors((prev) => ({
                  ...prev,
                  email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                }));
              }}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">Correo no válido.</p>
            )}
          </div>
        </div>

        {/* Fecha de Entrega */}
        <div className="mb-6">
          <input
            type="datetime-local"
            className={inputClass("fechaEntrega")}
            min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
            value={userData.fechaEntrega}
            onChange={(e) => {
              const value = e.target.value;
              const fecha = new Date(value);
              const hora = fecha.getHours();

              const horaValida = hora >= 9 && hora < 18;
              setUserData((prev) => ({ ...prev, fechaEntrega: value }));
              setErrors((prev) => ({
                ...prev,
                fechaEntrega: !value || !horaValida,
              }));
            }}
          />
          {errors.fechaEntrega && (
            <p className="text-sm text-red-500 mt-1">Hora inválida (9:00 a 18:00).</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            ⏰ Selecciona mínimo 1 hora desde ahora. Atención: 9:00 a.m. - 6:00 p.m.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setShowUserForm(false)}
            className="py-2 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (validarCampos()) {
                setShowUserForm(false);
                handleFinalizar();
              }
            }}
            className="py-2 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUsuario;
