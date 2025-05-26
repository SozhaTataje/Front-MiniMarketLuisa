import {BrowserRouter,Routes,Route, Navigate, Outlet, useLocation, } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import AdminLayout from "./layouts/AdminLayout";


import Home from "./pages/Home";
import ProductList from "./components/ProductList"; 
import Carrito from "./pages/Carrito";
import Sucursales from "./pages/Sucursales";
import MiCuenta from "./pages/MiCuenta";
import ConfirmarCorreo from "./pages/ConfirmarCorreo";
import PedidoConfirmacion from "./pages/PedidoConfirmacion";


import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Productos from "./pages/admin/Productos";
import SucursalesAdmin from "./pages/admin/Sucursales";
import Usuarios from "./pages/admin/Usuarios";

function RutaPrivada({ children, rolRequerido }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/mi-cuenta" />;

  const roles = Array.isArray(usuario.roles)  ? usuario.roles : usuario.rol ? [usuario.rol] : [];

  if (rolRequerido && !roles.includes(rolRequerido)) return <Navigate to="/" />;

  return children;
}

function ClienteLayout() {
  const location = useLocation();
  const esRutaAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      {!esRutaAdmin && <Navbar />}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ClienteLayout />}>
            <Route path="/" element={<Home />} />
             <Route path="/productos" element={<ProductList />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
            <Route path="/confirmar-correo" element={<ConfirmarCorreo />} />
            <Route path="/pedido/:id" element={<PedidoConfirmacion />} />
          </Route>


          <Route
            path="/admin"
            element={ 
              <RutaPrivada rolRequerido="ROLE_ADMIN">
                <AdminLayout />
              </RutaPrivada>
            }
          >
            <Route index element={<DashboardAdmin />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="productos" element={<Productos />} />
            <Route path="sucursales" element={<SucursalesAdmin />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
