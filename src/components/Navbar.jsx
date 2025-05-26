import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const { cantidadTotal } = useContext(CartContext);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/productos?buscar=${encodeURIComponent(search)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md animate-fade-in-down">
      <nav className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300">
        <Link
          to="/"
          className="text-2xl font-bold text-purple-600 hover:scale-105 transition-transform duration-300"
        >
          <span className="text-purple-500">Minimarket</span>{" "}
          <span className="text-orange-500">Luisa</span>
        </Link>
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full md:w-1/3 bg-gray-100 rounded overflow-hidden shadow-inner"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 bg-transparent outline-none transition-all"
            placeholder="Buscar productos..."
          />
          <button
            type="submit"
            className="px-3 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-all"
          >
            <FaSearch />
          </button>
        </form>

        <div className="flex items-center gap-5 text-sm md:text-base transition-all duration-300">
          <Link to="/" className="hover:text-purple-600 font-medium">
            Inicio
          </Link>
          <Link to="/productos" className="hover:text-purple-600 font-medium">
            Productos
          </Link>
          <Link to="/sucursales" className="hover:text-purple-600 font-medium">
            Sucursales
          </Link>

          {usuario?.roles?.includes("ROLE_ADMIN") && (
            <Link to="/admin/dashboard" className="text-purple-600 font-bold">
              Admin Panel
            </Link>
          )}

          {!usuario && (
            <Link to="/mi-cuenta" className="hover:text-purple-600 font-medium">
              Mi cuenta
            </Link>
          )}
          {usuario && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-purple-600 text-xl hover:text-purple-800 focus:outline-none flex items-center gap-1"
                aria-label="Perfil usuario"
              >
                <FaUserCircle />
                <span className="hidden md:inline-block font-semibold truncate max-w-[100px]">
                  {usuario.nombre}
                </span>
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  <ul className="py-1 text-gray-800">
                    <li>
                      <Link
                        to="/mis-pedidos"
                        className="block px-4 py-2 hover:bg-purple-100 text-sm font-medium"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Mis pedidos
                      </Link>
                    </li>
                   <li className="px-4 py-2 text-xs text-gray-800 border-t border-gray-200">
                      {usuario.email}
                    </li>
                    <li className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-black hover:bg-red-500 hover:text-white transition-colors"
                      >
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
            className="relative text-purple-600 text-xl hover:scale-110 transition-transform"
          >
            <FaShoppingCart />
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 animate-pulse">
                {cantidadTotal}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
