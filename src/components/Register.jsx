import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formulario, setFormulario] = useState({
    username: "",
    password: "",
    nombre: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formulario);
      navigate("/mi-cuenta", { state: { modo: "login" } });
    } catch {
      setError("Error al registrar");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Registrarse</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded"
          value={formulario.nombre}
          onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Usuario"
          className="w-full p-2 border rounded"
          value={formulario.username}
          onChange={(e) => setFormulario({ ...formulario, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={formulario.password}
          onChange={(e) => setFormulario({ ...formulario, password: e.target.value })}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
