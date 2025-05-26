import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {jwtDecode} from "jwt-decode"; 

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credenciales, setCredenciales] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/usuario/login", credenciales);
      const token = response.data.token;
      if (!token) {
        setError("No se recibió token de autenticación");
        return;
      }

      login(token);

      const decoded = jwtDecode(token);
      const roles = decoded.rol?.map((r) => r.authority) || [];

      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/productos"); 
      }
    } catch (err) {
      console.log("Error login:", err.response?.status, err.response?.data);
      const status = err.response?.status;
      const message = err.response?.data || "";

      if (
        status === 403 &&
        typeof message === "string" &&
        message.toLowerCase().includes("no se ha verificado")
      ) {
        localStorage.setItem("emailConfirmacion", credenciales.email);

        navigate("/confirmar-correo", { state: { email: credenciales.email } });
      } else {
        setError("Usuario o contraseña inválidos");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded"
          value={credenciales.email}
          onChange={(e) => setCredenciales({ ...credenciales, email: e.target.value })}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={credenciales.password}
          onChange={(e) => setCredenciales({ ...credenciales, password: e.target.value })}
          required
          autoComplete="current-password"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;