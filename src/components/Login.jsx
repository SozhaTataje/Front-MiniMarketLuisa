import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState("");

  const {register,handleSubmit, formState: { errors }} = useForm();

  const onSubmit = async (credenciales) => {
    setErrorLogin("");
    try {
      const response = await api.post("/usuario/login", credenciales);
      const token = response.data.token;
      if (!token) {
        setErrorLogin("No se recibió token de autenticación");
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
        setErrorLogin("Usuario o contraseña inválidos");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-purple-600">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border rounded"
            autoComplete="email"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 border rounded"
            autoComplete="current-password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {errorLogin && <p className="text-red-500">{errorLogin}</p>}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
