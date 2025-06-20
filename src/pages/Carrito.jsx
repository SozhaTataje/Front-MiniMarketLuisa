import { useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { CartContext } from "../context/CartContext";

const Carrito = () => {
  const { carrito, setCarrito, vaciarCarrito } = useContext(CartContext);
  const [procesando, setProcesando] = useState(false);
  const [userData, setUserData] = useState({ nombre: "", apellido: "", direccion: "", telefono: "", email: "" });
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [stockSucursal, setStockSucursal] = useState({});
  const [showUserForm, setShowUserForm] = useState(false);
  const [cargando, setCargando] = useState({ sucursales: false, stock: false });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserData(prev => ({ ...prev, email: payload.email || "", telefono: payload.telefono || "" }));
      } catch (err) {
        console.error("Token inválido", err);
      }
    }
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    setCargando(prev => ({ ...prev, sucursales: true }));
    try {
      const res = await api.get("/sucursal/all", { params: { param: "x" } });
      const data = res.data;
      setSucursales(data);
      if (data.length > 0) {
        setSucursalSeleccionada(data[0]);
        cargarStock(data[0].idsucursal);
      }
    } catch (error) {
      console.error("Error cargando sucursales", error);
    } finally {
      setCargando(prev => ({ ...prev, sucursales: false }));
    }
  };

  const cargarStock = async (idsucursal) => {
    setCargando(prev => ({ ...prev, stock: true }));
    try {
      const { data } = await api.get(`/productosucursal/sucursal/${idsucursal}`);
      const stockMap = {};
      data.forEach(p => {
        stockMap[p.idProductoSucursal] = {
          stock: p.stock,
          reservado: p.stockReservado || 0,
          disponible: p.stock - (p.stockReservado || 0),
        };
      });
      setStockSucursal(stockMap);
    } catch (error) {
      console.error("Error cargando stock", error);
    } finally {
      setCargando(prev => ({ ...prev, stock: false }));
    }
  };

  const incrementar = (id) => {
    const item = carrito.find(p => p.idProductoSucursal === id);
    const stockInfo = stockSucursal[id];
    if (!stockInfo || item.cantidad >= stockInfo.disponible) return alert("Stock insuficiente en esta sucursal");

    setCarrito(prev =>
      prev.map(p =>
        p.idProductoSucursal === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  const disminuir = (id) => {
    setCarrito(prev =>
      prev.map(p =>
        p.idProductoSucursal === id && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p
      ).filter(p => p.cantidad > 0)
    );
  };

  const eliminar = (id) => setCarrito(prev => prev.filter(p => p.idProductoSucursal !== id));

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const validarUsuario = () => {
    return ["nombre", "apellido", "direccion", "telefono", "email"].every(campo => userData[campo]?.trim());
  };

  const hayErrorStock = carrito.some(p => {
    const stock = stockSucursal[p.idProductoSucursal];
    return !stock || p.cantidad > stock.disponible;
  });

  const handleFinalizar = async () => {
    if (procesando || hayErrorStock) return;
    if (carrito.length === 0) return alert("Tu carrito está vacío.");
    if (!sucursalSeleccionada) return alert("Selecciona una sucursal.");
    if (!validarUsuario()) return setShowUserForm(true);

    try {
      setProcesando(true);
      const pedido = {
        ...userData,
        fechapedido: new Date().toISOString(),
        fechaderecojo: null,
        fechapago: null,
        estado: "PENDIENTE",
        productos: carrito.map(p => ({
          idProductoSucursal: p.idProductoSucursal,
          cantidad: p.cantidad,
        })),
        local: sucursalSeleccionada.nombre
      };

      const res = await api.post("/pedido/save", pedido);
      const idPedido = res.data.idpedido;
      const pago = await api.get(`/pago/url/${idPedido}`);
      const url = pago.data;

      if (!url.startsWith("https")) throw new Error("URL de pago inválida");

      vaciarCarrito();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Error al procesar el pedido");
    } finally {
      setProcesando(false);
    }
  };

  const FormUsuario = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border border-purple-200">
        <h2 className="text-xl font-bold text-purple-700 mb-4 text-center"> Completa tus datos</h2>
        {["nombre", "apellido", "direccion", "telefono", "email"].map(campo => (
          <div className="mb-3" key={campo}>
            <label className="text-sm font-medium text-gray-700">
              {campo[0].toUpperCase() + campo.slice(1)}
            </label>
            <input
              type={campo === "email" ? "email" : "text"}
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-purple-300"
              value={userData[campo]}
              onChange={(e) => setUserData(prev => ({ ...prev, [campo]: e.target.value }))}
            />
          </div>
        ))}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowUserForm(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (validarUsuario()) {
                setShowUserForm(false);
                setTimeout(() => handleFinalizar(), 0);
              } else {
                alert("Por favor completa todos los campos.");
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-purple-700 text-center mb-6"> Tu Carrito</h1>

      {/* Sucursal */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2"> Selecciona Sucursal:</h3>
        {cargando.sucursales ? (
          <p className="text-gray-500">Cargando sucursales...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sucursales.map(s => (
              <button
                key={s.idsucursal}
                onClick={() => {
                  setSucursalSeleccionada(s);
                  cargarStock(s.idsucursal);
                }}
                className={`px-4 py-2 rounded border ${
                  sucursalSeleccionada?.idsucursal === s.idsucursal
                    ? "bg-purple-100 border-purple-500 text-purple-700"
                    : "bg-white border-gray-300 hover:border-purple-300"
                }`}
              >
                {s.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Productos */}
      {carrito.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos en el carrito.</p>
      ) : (
        <table className="w-full table-auto bg-white shadow rounded">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => {
              const stock = stockSucursal[item.idProductoSucursal];
              const disponible = stock?.disponible || 0;
              return (
                <tr key={item.idProductoSucursal} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.nombre}</td>
                  <td className="p-3 text-center">S/ {item.precio.toFixed(2)}</td>
                  <td className="p-3 text-center">{item.cantidad}</td>
                  <td className="p-3 text-center">S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                  <td className="p-3 text-center">
                    {stock ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${disponible === 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                        {disponible} disponibles
                      </span>
                    ) : (
                      <span className="text-red-500">No disponible</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button onClick={() => incrementar(item.idProductoSucursal)} className="bg-purple-500 text-white px-2 py-1 rounded">+</button>
                    <button onClick={() => disminuir(item.idProductoSucursal)} className="bg-purple-500 text-white px-2 py-1 rounded">−</button>
                    <button onClick={() => eliminar(item.idProductoSucursal)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Total y acciones */}
      {carrito.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Total: <span className="text-purple-600">S/ {total.toFixed(2)}</span>
          </h2>
          <div className="flex gap-4">
            <button onClick={vaciarCarrito} className="px-5 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50">Vaciar</button>
            <button
              onClick={() => {
                if (!validarUsuario()) {
                  setShowUserForm(true);
                } else {
                  handleFinalizar();
                }
              }}
              disabled={procesando || !sucursalSeleccionada || cargando.stock || hayErrorStock}
              className={`px-5 py-2 rounded text-white font-bold ${
                procesando || !sucursalSeleccionada || cargando.stock || hayErrorStock
                  ? "bg-gray-400"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {procesando ? "Procesando..." : "Finalizar compra"}
            </button>
          </div>
        </div>
      )}

      {showUserForm && <FormUsuario />}
    </div>
  );
};

export default Carrito;
