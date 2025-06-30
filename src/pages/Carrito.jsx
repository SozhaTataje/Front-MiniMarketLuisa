import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaStore, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import ModalUsuario from "../components/ModalUsuario";
import { CartContext } from "../context/CartContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast"; 

const Carrito = () => {
  const { carrito, setCarrito, vaciarCarrito } = useContext(CartContext);
  const [procesando, setProcesando] = useState(false);
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

    if (carrito.length > 0) {
      const idSucursal = carrito[0].idSucursal;
      cargarStock(idSucursal);
    }
  }, [carrito]);

  const cargarStock = async (id) => {
    try {
      const { data } = await api.get(`/productosucursal/sucursal/${id}`);
      setStockSucursal((prevStock) => {
        const nuevoStock = { ...prevStock };
        data.forEach((p) => {
          nuevoStock[p.idProductoSucursal] = {
            disponible: p.stock - (p.stockReservado || 0),
          };
        });
        return nuevoStock;
      });
    } catch (err) {
      console.error("Error stock", err);
    }
  };

  const incrementar = (id) => {
    const item = carrito.find((p) => p.idProductoSucursal === id);
    const stock = stockSucursal[id];
    if (!stock || item.cantidad >= stock.disponible) {
      toast.error("Stock insuficiente");
    }
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

  const handleFinalizarClick = () => {
    const camposCompletos = [
      userData.nombre,
      userData.apellido,
      userData.direccion || "RECOJO EN TIENDA",
      userData.telefono,
      userData.email,
      userData.fechaEntrega,
    ].every(Boolean);

    if (camposCompletos) {
      handleFinalizar();
    } else {
      setShowUserForm(true);
    }
  };

  const handleFinalizar = async (formData = null) => {
    if (procesando || carrito.length === 0) return;

    if (formData) setUserData(formData);
    const data = formData || userData;

    const errores = {};
    if (!data.nombre?.trim()) errores.nombre = true;
    if (!data.apellido?.trim()) errores.apellido = true;
    if (!data.direccion?.trim()) errores.direccion = true;
    if (!/^\d{9,}$/.test(data.telefono)) errores.telefono = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errores.email = true;
    const hora = new Date(data.fechaEntrega).getHours();
    if (!data.fechaEntrega || hora < 9 || hora >= 22) errores.fechaEntrega = true;

    setErrors(errores);
    if (Object.keys(errores).length > 0) return;

    try {
      setProcesando(true);
      const pedido = {
        ...data,
        fechapedido: new Date().toISOString(),
        fechaderecojo: data.fechaEntrega,
        estado: "PENDIENTE",
        productos: carrito.map((p) => ({
          idProductoSucursal: p.idProductoSucursal,
          cantidad: p.cantidad,
        })),
        local: carrito[0]?.nombreSucursal || "Sucursal no definida",
      };
      const res = await api.post("/pedido/save", pedido);
      const pago = await api.get(`/pago/url/${res.data.idpedido}`);
      vaciarCarrito();
      window.location.href = pago.data;
    } catch {
      toast("Error al procesar el pedido");
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
          <Link
            to="/productos"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Ver Productos
          </Link>
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
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <FaStore className="text-purple-600" />
                  Sucursal
                </h3>
                <p className="text-gray-800 font-semibold bg-gray-100 px-4 py-2 rounded-lg w-max">
                  {carrito[0]?.nombreSucursal || "Sucursal no definida"}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {carrito.map((item) => {
                  const disponible =
                    stockSucursal[item.idProductoSucursal]?.disponible ?? item.stock;
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
                          <span className="w-8 text-center font-bold">{item.cantidad}</span>
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
                  <span>Productos</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-purple-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleFinalizarClick}
                  disabled={procesando}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-300"
                >
                  {procesando ? "Procesando..." : "Finalizar Compra"}
                </button>
                <button
                  onClick={vaciarCarrito}
                  className="w-full py-2 border bg-red-500 text-white rounded-lg hover:bg-red-700"
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
            handleFinalizar={handleFinalizar}
            sucursal={{ nombre: carrito[0]?.nombreSucursal || "" }}
          />
        )}
      </div>
    </>
  );
};

export default Carrito;
