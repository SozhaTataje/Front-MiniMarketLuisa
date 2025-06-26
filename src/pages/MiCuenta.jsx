import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast"; 

const MiCuenta = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [modo, setModo] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (isSubmitting) return;
    setIsSubmitting(true);

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
        toast.success("Inicio de sesión exitoso");

        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin/dashboard");
        } else {
          navigate("/productos");
        }

      } else {
        await api.post("api/usuario/signup", form);
        toast.success("Registro exitoso. Ahora inicia sesión");

        setForm({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          password: "",
        });
        setModo("login");
      }

    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.includes("no se ha verificado")
      ) {
        toast.error("Usuario no verificado. Revisa tu correo 📧");
        navigate("/confirmar-correo", { state: { email: form.email } });
      } else {
        const errorMessage = error.response?.data || error.message || "Error del servidor";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto mt-10 p-8 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl max-w-lg border border-purple-100">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => {
                setModo("login");
                setForm({ nombre: "", apellido: "", email: "", telefono: "", password: "" });
              }}
              className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 ${
                modo === "login"
                  ? "bg-purple-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              disabled={isSubmitting}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setModo("registro");
                setForm({ nombre: "", apellido: "", email: "", telefono: "", password: "" });
              }}
              className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 ${
                modo === "registro"
                  ? "bg-purple-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              disabled={isSubmitting}
            >
              Registrarse
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {modo === "registro" && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/80"
                value={form.nombre}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/80"
                value={form.apellido}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/80"
                value={form.telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,9}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                required
                disabled={isSubmitting}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/80"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white/80"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform ${
              isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:scale-105 shadow-lg hover:shadow-xl"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {modo === "login" ? "Iniciando sesión..." : "Registrando..."}
              </div>
            ) : (
              modo === "login" ? "Iniciar Sesión" : "Registrarse"
            )}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default MiCuenta;