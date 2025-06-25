import { useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { CartContext } from "../context/CartContext";
import {FaShoppingCart, FaStore, FaTrash, FaPlus, FaMinus,} from "react-icons/fa";
import ModalUsuario from "../components/ModalUsuario";

const Carrito = () => {
  const { carrito, setCarrito, vaciarCarrito } = useContext(CartContext);
  const [procesando, setProcesando] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [stockSucursal, setStockSucursal] = useState({});
  const [showUserForm, setShowUserForm] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    fechaEntrega: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserData((prev) => ({
          ...prev,
          nombre: payload.nombre || "",
          apellido: payload.apellido || "",
          email: payload.email || "",
          telefono: payload.telefono || "",
          direccion: payload.direccion || "",
        }));
      } catch (e) {
        console.error("Token inválido", e);
      }
    }
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    try {
      const res = await api.get("/sucursal/all", { params: { param: "x" } });
      setSucursales(res.data);
      if (res.data.length > 0) {
        setSucursalSeleccionada(res.data[0]);
        cargarStock(res.data[0].idsucursal);
      }
    } catch (err) {
      console.error("Error cargando sucursales", err);
    }
  };

  const cargarStock = async (id) => {
    try {
      const { data } = await api.get(`/productosucursal/sucursal/${id}`);
      const stockMap = {};
      data.forEach(
        (p) =>
          (stockMap[p.idProductoSucursal] = {
            disponible: p.stock - (p.stockReservado || 0),
          })
      );
      setStockSucursal(stockMap);
    } catch (err) {
      console.error("Error stock", err);
    }
  };

  const incrementar = (id) => {
    const item = carrito.find((p) => p.idProductoSucursal === id);
    const stock = stockSucursal[id];
    if (!stock || item.cantidad >= stock.disponible)
      return alert("Stock insuficiente");
    setCarrito((prev) =>
      prev.map((p) =>
        p.idProductoSucursal === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  const disminuir = (id) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.idProductoSucursal === id && p.cantidad > 1
            ? { ...p, cantidad: p.cantidad - 1 }
            : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const eliminar = (id) =>
    setCarrito((prev) => prev.filter((p) => p.idProductoSucursal !== id));

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const validarCampos = () => {
    const e = {};
    if (!userData.nombre.trim()) e.nombre = true;
    if (!userData.apellido.trim()) e.apellido = true;
    if (!userData.direccion.trim()) e.direccion = true;
    if (!/^\d{9,}$/.test(userData.telefono)) e.telefono = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) e.email = true;
    if (!userData.fechaEntrega) e.fechaEntrega = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFinalizar = async () => {
    if (procesando || carrito.length === 0 || !sucursalSeleccionada) return;
    if (!validarCampos()) return setShowUserForm(true);

    try {
      setProcesando(true);
      const pedido = {
        ...userData,
        fechapedido: new Date().toISOString(),
        fechaderecojo: userData.fechaEntrega,
        estado: "PENDIENTE",
        productos: carrito.map((p) => ({
          idProductoSucursal: p.idProductoSucursal,
          cantidad: p.cantidad,
        })),
        local: sucursalSeleccionada.nombre,
      };
      const res = await api.post("/pedido/save", pedido);
      const pago = await api.get(`/pago/url/${res.data.idpedido}`);
      vaciarCarrito();
      window.location.href = pago.data;
    } catch {
      alert("Error al procesar el pedido");
    } finally {
      setProcesando(false);
    }
  };

  if (carrito.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
        <div>
          <FaShoppingCart className="text-6xl text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Tu carrito está vacío
          </h2>
          <a
            href="/productos"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Ver Productos
          </a>
        </div>
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
            Tu Carrito
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <FaStore className="text-purple-600" />
                  Sucursal
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sucursales.map((s) => (
                    <button
                      key={s.idsucursal}
                      onClick={() => {
                        setSucursalSeleccionada(s);
                        cargarStock(s.idsucursal);
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        sucursalSeleccionada?.idsucursal === s.idsucursal
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 hover:bg-purple-100"
                      }`}
                    >
                      {s.nombre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {carrito.map((item) => {
                  const disponible =
                    stockSucursal[item.idProductoSucursal]?.disponible || 0;
                  return (
                    <div
                      key={item.idProductoSucursal}
                      className="p-6 border-b last:border-none flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-lg">{item.nombre}</h4>
                        <p className="text-purple-600 font-bold">
                          S/ {item.precio.toFixed(2)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            disponible === 0
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {disponible} disponibles
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => disminuir(item.idProductoSucursal)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-purple-200"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-8 text-center font-bold">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => incrementar(item.idProductoSucursal)}
                            className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <p className="font-bold min-w-[80px]">
                          S/ {(item.precio * item.cantidad).toFixed(2)}
                        </p>
                        <button
                          onClick={() => eliminar(item.idProductoSucursal)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg h-fit">
              <h3 className="text-xl font-bold mb-4">Resumen</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Productos ({carrito.length})</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-purple-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleFinalizar}
                  disabled={procesando}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-300"
                >
                  {procesando ? "Procesando..." : "Finalizar Compra"}
                </button>
                <button
                  onClick={vaciarCarrito}
                  className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>

        {showUserForm && (
          <ModalUsuario
            userData={userData}
            setUserData={setUserData}
            errors={errors}
            setErrors={setErrors}
            setShowUserForm={setShowUserForm}
            validarCampos={validarCampos}
            handleFinalizar={handleFinalizar}
          />
        )}
      </div>
    </>
  );
};

export default Carrito;
