import React from "react";
import { FiHome, FiBox, FiMapPin, FiUsers, FiShoppingCart, FiTag, FiPackage   } from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
    { label: "Productos", icon: <FiBox />, path: "/admin/productos" },
    { label: "Categorías", icon: <FiTag />, path: "/admin/categorias" },
    { label: "Pedidos", icon: <FiShoppingCart />, path: "/admin/pedidos" },
    { label: "Sucursales", icon: <FiMapPin />, path: "/admin/sucursales" },
    { label: "Usuarios", icon: <FiUsers />, path: "/admin/usuarios" },
    { label: "ProductosGenerales", icon: <FiPackage  />, path: "/admin/productosGenerales" },

  ];

  return (
    <aside className="w-64 bg-purple-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Minimarket Luisa</h2>
      
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-700 transition-colors ${
              pathname === item.path ? "bg-purple-700" : ""
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      
    </aside>
  );
};

export default Sidebar;