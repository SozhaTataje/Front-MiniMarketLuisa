import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const ConfirmarCorreo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem("emailConfirmacion");

  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    try {
      await api.post("/api/usuario/verificar", { email, code: codigo });
      setMensaje("Correo confirmado correctamente. Ya puedes iniciar sesión.");
      localStorage.removeItem("emailConfirmacion");
      setTimeout(() => {
        navigate("/mi-cuenta", { state: { modo: "login" } });
      }, 2000);
    } catch  {
      setError("Código incorrecto o expirado. Intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Confirmar correo</h2>
      <p>Se envió un código a tu correo: <b>{email}</b></p>
      <form onSubmit={handleConfirmar} className="space-y-4">
        <input
          type="text"
          placeholder="Código de confirmación"
          className="w-full p-2 border rounded"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        {mensaje && <p className="text-green-500">{mensaje}</p>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Confirmar
        </button>
      </form>
    </div>
  );
};

export default ConfirmarCorreo;
