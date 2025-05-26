import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RutaPrivada = ({ children, rolRequerido }) => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return <Navigate to="/mi-cuenta" />;
  }

  if (rolRequerido && !usuario.roles.includes(rolRequerido)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RutaPrivada;
