import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";
import api from "../../../../api/axiosInstance";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const EditSucursalModal = ({ isOpen, onClose, onUpdated, sucursal }) => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    lat: "",
    lon: "",
  });
  const [loading, setLoading] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBI58DtAF-zwB33Bw_bZwHC8RsgQKFSwjw",
  });

  useEffect(() => {
    if (sucursal) {
      setForm({
        nombre: sucursal.nombre || "",
        direccion: sucursal.direccion || "",
        ciudad: sucursal.ciudad || "",
        lat: sucursal.lat || "",
        lon: sucursal.lon || "",
      });
    }
  }, [sucursal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.direccion || !form.ciudad) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!form.lat || !form.lon) {
      alert("Por favor selecciona una ubicación en el mapa.");
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        nombre: form.nombre,
        direccion: form.direccion,
        ciudad: form.ciudad,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
      };

      await api.put(`/sucursal/update/${sucursal.idsucursal}`, dataToSend);
      alert("Sucursal actualizada correctamente.");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar sucursal:", error);
      alert("Error al actualizar sucursal: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
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
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
        Editar Sucursal
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Nombre:</label>
          <input
            name="nombre"
            placeholder="Nombre de la sucursal"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Dirección:</label>
          <input
            name="direccion"
            placeholder="Dirección completa"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Ciudad:</label>
          <input
            name="ciudad"
            placeholder="Ciudad"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.ciudad}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Ubicación en el mapa:
          </label>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={{
              lat: parseFloat(form.lat) || -14.089864163920964,
              lng: parseFloat(form.lon) || -75.74606562072026,
            }}
            onClick={handleMapClick}
          >
            {form.lat && form.lon && (
              <Marker 
                position={{ 
                  lat: parseFloat(form.lat), 
                  lng: parseFloat(form.lon) 
                }} 
              />
            )}
          </GoogleMap>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Latitud:</label>
            <input
              name="lat"
              type="number"
              step="any"
              placeholder="Latitud"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              value={form.lat}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Longitud:</label>
            <input
              name="lon"
              type="number"
              step="any"
              placeholder="Longitud"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              value={form.lon}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-md font-semibold text-white transition-colors ${
            loading 
              ? "bg-purple-400 cursor-not-allowed" 
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
    </Modal>
  );
};

export default EditSucursalModal;