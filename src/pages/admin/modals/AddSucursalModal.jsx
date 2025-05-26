import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import api from "../../../api/axiosInstance";
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
    googleMapsApiKey: "AIzaSyBI58DtAF-zwB33Bw_bZwHC8RsgQKFSwjw", 
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
      className="p-6 bg-white rounded shadow-lg max-w-md mx-auto my-10 max-h-[90vh] flex flex-col"
    >
      <div className="overflow-y-auto flex-grow">
        <h2 className="text-xl font-bold mb-4">Agregar Sucursal</h2>
        <input
          name="nombre"
          placeholder="Nombre"
          className="w-full mb-2 p-2 border"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          className="w-full mb-2 p-2 border"
          value={form.direccion}
          onChange={handleChange}
        />
        <input
          name="ciudad"
          placeholder="Ciudad"
          className="w-full mb-2 p-2 border"
          value={form.ciudad}
          onChange={handleChange}
        />

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">
            Selecciona la ubicación en el mapa:
          </p>
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

        <input
          name="lat"
          type="number"
          placeholder="Latitud"
          className="w-full mb-2 p-2 border"
          value={form.lat}
          readOnly
        />
        <input
          name="lon"
          type="number"
          placeholder="Longitud"
          className="w-full mb-2 p-2 border"
          value={form.lon}
          readOnly
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
      >
        Guardar
      </button>
    </Modal>
  );
};

export default AddSucursalModal;
