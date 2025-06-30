import {BrowserRouter,Routes,Route,Navigate,Outlet,useLocation,} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider} from "./context/AuthContext";

import Navbar from "./components/Navbar";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Carrito from "./pages/Carrito";
import Sucursales from "./pages/Sucursales";
import MiCuenta from "./pages/MiCuenta";
import ConfirmarCorreo from "./pages/ConfirmarCorreo";
import PedidoConfirmacion from "./pages/PedidoConfirmacion";
import HistorialPedidos from "./pages/HistorialPedidos";
import MisDatos from "./pages/MisDatos";
import RutaPrivada from "./components/RutaPrivada";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ProductosGenerales from "./pages/admin/ProductosGenerales";
import ProductosSucursales from "./pages/admin/ProductosSucursales";
import SucursalesAdmin from "./pages/admin/Sucursales";
import Usuarios from "./pages/admin/Usuarios";
import Pedidos from "./pages/admin/Pedidos";
import Categorias from "./pages/admin/Categorias";


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
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route element={<ClienteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
            <Route path="/confirmar-correo" element={<ConfirmarCorreo />} />
            <Route path="/pedido/:id" element={<PedidoConfirmacion />} />
            <Route path="/mis-pedidos" element={<HistorialPedidos />} />
            <Route path="/mis-datos" element={<MisDatos />} />
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
            <Route path="productosGenerales" element={<ProductosGenerales />} />
            <Route path="productosSucursales" element={<ProductosSucursales />} />
            <Route path="sucursales" element={<SucursalesAdmin />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
