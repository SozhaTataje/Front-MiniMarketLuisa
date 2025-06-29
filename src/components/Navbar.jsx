import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaCog,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { Search } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const { cantidadTotal } = useContext(CartContext);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/productos?buscar=${encodeURIComponent(search)}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md">
      <nav className="p-5 max-w-screen-xl mx-auto flex justify-between items-center relative">
        <Link
          to="/"
          className="text-3xl font-bold text-purple-600 hover:scale-105 transition-transform duration-300"
        >
          <span className="text-purple-500">Minimarket</span>{" "}
          <span className="text-orange-500">Luisa</span>
        </Link>

        <button
          className="md:hidden text-3xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent z-50 transition-all duration-300 shadow-md md:shadow-none rounded-b-xl ${
            menuOpen ? "block" : "hidden"
          } md:flex md:items-center md:gap-6`}
        >
          <form
            onSubmit={handleSearch}
            className="mx-4 my-4 md:my-0 md:mx-0 w-[95%] md:w-96"
          >
            <div className="flex items-center overflow-hidden rounded-xl shadow-md border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-300">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 outline-none bg-transparent text-base"
                placeholder="Buscar productos..."
              />
              <button
                type="submit"
                className="px-4 py-2 text-gray  transition-all duration-300 flex items-center justify-center"
              >
                <Search size={18} strokeWidth={2.2} />
              </button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 px-4 md:px-0 pb-4 md:pb-0 text-lg">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-purple-600 font-medium"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              onClick={() => setMenuOpen(false)}
              className="hover:text-purple-600 font-medium"
            >
              Productos
            </Link>
            <Link
              to="/sucursales"
              onClick={() => setMenuOpen(false)}
              className="hover:text-purple-600 font-medium"
            >
              Sucursales
            </Link>

            {usuario?.roles?.includes("ROLE_ADMIN") && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1 px-5 py-3 rounded-full"
              >
                <FaCog className="w-4 h-4 text-white" />
              </Link>
            )}

            {!usuario ? (
              <Link
                to="/mi-cuenta"
                onClick={() => setMenuOpen(false)}
                className=" text-black-700 font-medium px-3 py-2 rounded-full"
              >
                Mi cuenta
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-purple-700 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-md border border-purple-200"
                  aria-label="Perfil usuario"
                >
                  <div className="relative">
                    <FaUserCircle className="text-xl" />
                  </div>
                  <span className="hidden md:inline-block font-semibold truncate max-w-[120px]">
                    {usuario.nombre}
                  </span>
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white backdrop-blur-xl border border-purple-200 rounded-2xl shadow-2xl z-10 overflow-hidden">
                    <div className="bg-purple-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <FaUserCircle className="text-2xl" />
                        </div>
                        <div>
                          <p className="font-bold">{usuario.nombre}</p>
                          <p className="text-purple-100 text-xs ">
                            {usuario.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="py-2">
                      <li>
                        <Link
                          to="/mis-pedidos"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-gray-700 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <FaClipboardList className="w-4 h-4 text-purple-600" />
                          </div>
                          Mis pedidos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/mis-datos"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-gray-700 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaUser className="w-4 h-4 text-blue-600" />
                          </div>
                          Mis datos
                        </Link>
                      </li>

                      <li className="border-t border-gray-200 mt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FaSignOutAlt className="w-4 h-4 text-red-600" />
                          </div>
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            <Link
              to="/carrito"
              onClick={() => setMenuOpen(false)}
              className="relative text-purple-600 text-2xl hover:scale-110 transition-transform"
            >
              <FaShoppingCart />
              {cantidadTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 animate-pulse">
                  {cantidadTotal}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
