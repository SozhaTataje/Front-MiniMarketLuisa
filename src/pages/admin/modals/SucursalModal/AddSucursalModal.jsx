import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import api from "../../../../api/axiosInstance";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: -14.089864163920964,
  lng: -75.74606562072026,
};

const AddSucursalModal = ({ isOpen, onClose, onAdded }) => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    lat: "",
    lon: "",
    codigo_propio: "",
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBgGNXF0P28UyZUTKfcrQu3UKZfWUEpMEU",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.lat || !form.lon) {
        alert("Por favor selecciona una ubicación en el mapa.");
        return;
      }

      const dataToSend = {
        ...form,
        lat: form.lat,
        lon: form.lon,
        codigo_propio: `${form.nombre.slice(0, 3)}_${form.ciudad.slice(
          0,
          3
        )}`.toUpperCase(),
      };

      await api.post("/sucursal/save", dataToSend);
      alert("Sucursal agregada correctamente.");
      onAdded();
      onClose();
    } catch (error) {
      console.error("Error al guardar sucursal:", error);
      alert("Error al guardar sucursal.");
    }
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lon = event.latLng.lng();
    setForm((prev) => ({ ...prev, lat, lon }));
  }, []);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white rounded-3xl shadow-2xl max-w-2xl mx-auto my-8 max-h-[95vh] flex flex-col"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"
    >
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-3xl p-6 text-white">
        <h2 className="text-2xl font-bold text-center">
          Agregar Nueva Sucursal
        </h2>

      </div>

      <div className="overflow-y-auto flex-grow p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Sucursal
            </label>
            <input
              name="nombre"
              placeholder="Ej: Sucursal Centro"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              name="ciudad"
              placeholder="Ej: Lima"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              value={form.ciudad}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dirección Completa
          </label>
          <input
            name="direccion"
            placeholder="Ej: Av. Principal 123, Centro Histórico"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            value={form.direccion}
            onChange={handleChange}
          />
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Ubicación en el Mapa
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Haz clic en el mapa para marcar la ubicación exacta de tu sucursal
          </p>
          <div className="rounded-xl overflow-hidden shadow-md">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={15}
              center={center}
              onClick={handleMapClick}
            >
              {form.lat && form.lon && (
                <Marker position={{ lat: form.lat, lng: form.lon }} />
              )}
            </GoogleMap>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Latitud
            </label>
            <input
              name="lat"
              type="number"
              placeholder="Automático"
              className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              value={form.lat}
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Longitud
            </label>
            <input
              name="lon"
              type="number"
              placeholder="Automático"
              className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              value={form.lon}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-b-3xl flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-105"
        >
          Guardar Sucursal
        </button>
      </div>
    </Modal>
  );
};

export default AddSucursalModal;
