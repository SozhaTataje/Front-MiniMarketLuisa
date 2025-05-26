import { useEffect, useState } from "react";
import axios from "axios";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/solid";

function Sucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3600/sucursal/all?param=x")
      .then((res) => setSucursales(res.data))
      .catch((err) => console.error("Error al cargar sucursales:", err));
  }, []);

  const closeModal = () => setSucursalSeleccionada(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-purple-700 text-center mb-12">
         Nuestras Sucursales
      </h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sucursales.map((suc) => (
          <div
            key={suc.idsucursal}
            onClick={() => setSucursalSeleccionada(suc)}
            className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPinIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {suc.nombre}
              </h2>
            </div>
            <p className="text-gray-600 mb-1">
            <span className="font-medium">{suc.direccion}</span>
            </p>
            <p className="text-gray-500 text-sm"> {suc.ciudad}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {sucursalSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] md:w-[600px] rounded-2xl p-6 relative shadow-xl animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={closeModal}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              {sucursalSeleccionada.nombre}
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Dirección:</strong> {sucursalSeleccionada.direccion}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Ciudad:</strong> {sucursalSeleccionada.ciudad}
            </p>

            {/* Mapa de Google con iframe */}
            <div className="w-full h-64 rounded-lg overflow-hidden shadow">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${sucursalSeleccionada.lat},${sucursalSeleccionada.lon}&z=16&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sucursales;
