import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Footer from "../components/Footer";
import {MapPinIcon, XMarkIcon, ClockIcon, BuildingStorefrontIcon, GlobeAltIcon} from "@heroicons/react/24/solid";

function Sucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/sucursal/all?param=x")
      .then((res) => {
        setSucursales(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar sucursales:", err);
        setLoading(false);
      });
  }, []);

  const closeModal = () => setSucursalSeleccionada(null);

  return (
    <>
      <div className="bg-gradient-to-r text-black py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Nuestras Sucursales</h1>
          <p className="text-black-100 mt-2">
            Tenemos {sucursales.length} sucursales para ti
          </p>
        </div>
      </div>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600">Cargando sucursales...</p>
            </div>
          ) : sucursales.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No hay sucursales disponibles por ahora.</p>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {sucursales.map((suc) => (
                <div
                  key={suc.idsucursal}
                  onClick={() => setSucursalSeleccionada(suc)}
                  className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.02] hover:border-purple-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <MapPinIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{suc.nombre}</h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <BuildingStorefrontIcon className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="text-gray-700 font-medium">{suc.direccion}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-600">{suc.ciudad}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">Abierto ahora</span>
                        </div>
                        <span className="text-gray-500">8:00 AM - 10:00 PM</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Ver ubicación</span>
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Ver detalles
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {sucursalSeleccionada && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 relative">
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
                onClick={closeModal}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <BuildingStorefrontIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{sucursalSeleccionada.nombre}</h2>
                  <p className="text-purple-100 text-lg">{sucursalSeleccionada.ciudad}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <BuildingStorefrontIcon className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Dirección</p>
                          <p className="text-gray-600">{sucursalSeleccionada.direccion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <GlobeAltIcon className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Ciudad</p>
                          <p className="text-gray-600">{sucursalSeleccionada.ciudad}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <ClockIcon className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Horarios</p>
                          <p className="text-gray-600">Lunes a Domingo</p>
                          <p className="text-gray-600">8:00 AM - 10:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Ubicación</h3>
                  <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${sucursalSeleccionada.lat},${sucursalSeleccionada.lon}&z=16&output=embed`}
                      allowFullScreen
                      loading="lazy"
                      title={`Mapa de ${sucursalSeleccionada.nombre}`}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default Sucursales;
