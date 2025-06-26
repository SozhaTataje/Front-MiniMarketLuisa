import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
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
                className="text-purple-600 font-bold"
              >
                Admin Panel
              </Link>
            )}

            {!usuario ? (
              <Link
                to="/mi-cuenta"
                onClick={() => setMenuOpen(false)}
                className="hover:text-purple-600 font-medium"
              >
                Mi cuenta
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-purple-600 text-xl hover:text-purple-800 flex items-center gap-1"
                  aria-label="Perfil usuario"
                >
                  <FaUserCircle />
                  <span className="hidden md:inline-block font-semibold truncate max-w-[120px]">
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    <ul className="py-1 text-gray-800">
                       <li className="px-4 py-2 text-xs text-gray-800 border-t border-gray-200">
                        {usuario.email}
                      </li>
                      <li>
                        <Link
                          to="/mis-pedidos"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMenuOpen(false);
                          }}
                          className="block px-4 py-2 hover:bg-purple-100 text-sm font-medium"
                        >
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
                          className="block px-4 py-2 hover:bg-purple-100 text-sm font-medium"
                        >
                          Mis datos personales
                        </Link>
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
