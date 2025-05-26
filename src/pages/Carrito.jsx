import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Carrito = () => {
  const { carrito, setCarrito, vaciarCarrito } = useContext(CartContext);
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  const incrementar = (idProductoSucursal) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.idProductoSucursal === idProductoSucursal
          ? item.cantidad < item.stock
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
          : item
      )
    );
  };

  const disminuir = (idProductoSucursal) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.idProductoSucursal === idProductoSucursal && item.cantidad > 1
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminar = (idProductoSucursal) => {
    setCarrito((prev) =>
      prev.filter((item) => item.idProductoSucursal !== idProductoSucursal)
    );
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const handleFinalizar = async () => {
    if (procesando) return;

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      navigate("/mi-cuenta");
      return;
    }

    for (const p of carrito) {
      if (!p.idProductoSucursal) {
        alert(`Falta el idProductoSucursal para: ${p.nombre}`);
        return;
      }
    }

    try {
      setProcesando(true);

      const pedido = {
        nombre: "Cliente",
        apellido: "Ejemplo",
        direccion: "Av. Principal 123",
        telefono: "999999999",
        email: "correo@ejemplo.com",
        fechaderecojo: null,
        fechapago: null,
        productos: carrito.map((item) => ({
          idProductoSucursal: item.idProductoSucursal,
          cantidad: item.cantidad,
        })),
        local: "Sucursal Central",
        metodoPago: "Tarjeta de Crédito",
      };

      const response = await fetch("http://localhost:3600/pedido/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) throw new Error("Error al registrar el pedido");

      const data = await response.json();
      const idPedido = data.idpedido;

      const pagoResponse = await fetch(
        `http://localhost:3600/pago/url/${idPedido}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!pagoResponse.ok) {
        const texto = await pagoResponse.text();
        console.error("Respuesta de pago fallida:", texto);
        throw new Error("Error al obtener URL de Stripe");
      }

      const urlPago = await pagoResponse.json().then((data) => data);

      if (!urlPago.startsWith("https")) {
        console.error("URL recibida no válida:", urlPago);
        throw new Error("URL inválida de Stripe");
      }

      vaciarCarrito();

      window.location.href = urlPago;
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert("Ocurrió un error al procesar la compra.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">
        Tu Carrito
      </h1>

      {carrito.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">Tu carrito está vacío.</p>
          <Link
            to="/productos"
            className="text-purple-600 font-medium hover:underline"
          >
            ← Volver a productos
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
           <table className="w-full table-auto text-sm md:text-base shadow-lg rounded-xl overflow-hidden">
  <thead>
    <tr className="bg-purple-100 text-purple-700">
      <th className="p-4 text-left">Producto</th>
      <th className="p-4">Precio</th>
      <th className="p-4">Cantidad</th>
      <th className="p-4">Subtotal</th>
      <th className="p-4 text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {carrito.map(item => (
      <tr key={item.idProductoSucursal} className="border-b hover:bg-gray-50 transition">
        <td className="p-4 font-medium text-gray-800">{item.nombre}</td>
        <td className="p-4 text-gray-600">S/ {item.precio.toFixed(2)}</td>
        <td className="p-4 text-center">{item.cantidad}</td>
        <td className="p-4 font-semibold text-purple-600">
          S/ {(item.precio * item.cantidad).toFixed(2)}
        </td>
        <td className="p-4 flex justify-center gap-2">
          <button
            onClick={() => incrementar(item.idProductoSucursal)}
            className="px-3 py-1 rounded text-white bg-purple-500 hover:bg-purple-600"
            disabled={item.cantidad >= item.stock}
            title={item.cantidad >= item.stock ? "Stock máximo alcanzado" : ""}
          >
            +
          </button>
          <button
            onClick={() => disminuir(item.idProductoSucursal)}
            className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-3 py-1 rounded"
          >
            −
          </button>
          <button
            onClick={() => eliminar(item.idProductoSucursal)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Total:{" "}
              <span className="text-purple-600">S/ {total.toFixed(2)}</span>
            </h2>

            <button
              onClick={handleFinalizar}
              disabled={procesando}
              className={`${
                procesando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white font-bold py-3 px-8 rounded-full shadow-lg transition`}
            >
              {procesando ? "Procesando..." : "Finalizar compra"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
