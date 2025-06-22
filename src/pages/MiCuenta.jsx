import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast"; // ✅ TOAST IMPORTADO

const MiCuenta = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [modo, setModo] = useState("login");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modo === "login") {
        const res = await api.post("api/usuario/login", {
          email: form.email,
          password: form.password,
        });

        const { token } = res.data;
        if (!token) {
          toast.error("No se recibió token en la respuesta");
          return;
        }

        login(token);

        const roles = JSON.parse(localStorage.getItem("roles")) || [];

        toast.success("Inicio de sesión exitoso 🎉");

        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin/dashboard");
        } else {
          navigate("/productos");
        }
      } else {
        await api.post("api/usuario/signup", form);
        toast.success("Registro exitoso. Ahora inicia sesión ✅");
        navigate("/mi-cuenta", { state: { modo: "login" } });
      }
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.includes("no se ha verificado")
      ) {
        toast.error("Usuario no verificado. Revisa tu correo 📧");
        navigate("/confirmar-correo", { state: { email: form.email } });
      } else {
        toast.error(
          error.response?.data || error.message || "Servidor no disponible"
        );
      }
    }
  };

  return (
    <>
      <div className="mx-auto mt-10 p-6 bg-white rounded-lg shadow-md max-w-lg h-95">
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setModo("login")}
            className={`px-4 py-2 font-semibold ${
              modo === "login"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setModo("registro")}
            className={`px-4 py-2 font-semibold ${
              modo === "registro"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === "registro" && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                className="w-full border border-gray-300 p-2 rounded"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                className="w-full border border-gray-300 p-2 rounded"
                value={form.apellido}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                className="w-full border border-gray-300 p-2 rounded"
                value={form.telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,9}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full border border-gray-300 p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full border border-gray-300 p-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            {modo === "login" ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default MiCuenta;
