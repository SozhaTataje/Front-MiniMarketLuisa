import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RutaPrivada = ({ children, rolRequerido }) => {
  const { usuario } = useContext(AuthContext);

  // Si no hay usuario logueado, redirigir al login
  if (!usuario) {
    return <Navigate to="/mi-cuenta" />;
  }

  if (rolRequerido) {
    if (rolRequerido === "ROLE_USER") {
      const tieneAcceso = usuario.roles.includes("ROLE_USER") || 
                         usuario.roles.includes("ROLE_ADMIN");
      if (!tieneAcceso) {
        return <Navigate to="/" />;
      }
    } 
    else if (rolRequerido === "ROLE_ADMIN") {
      if (!usuario.roles.includes("ROLE_ADMIN")) {
        return <Navigate to="/" />;
      }
    }
    else if (!usuario.roles.includes(rolRequerido)) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default RutaPrivada;