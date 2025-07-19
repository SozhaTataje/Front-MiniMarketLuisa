import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { MapPin, Plus, Trash2, Home, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const UbicacionManager = () => {
  const { usuario } = useAuth();
  const [ubicaciones, setUbicaciones] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario?.email) {
      cargarUbicaciones();
    }
  }, [usuario]);

  const cargarUbicaciones = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ubicacion-usuario/${usuario.email}`);
      setUbicaciones(Array.from(response.data) || []);
    } catch (error) {
      console.error('Error al cargar ubicaciones:', error);
      toast.error('Error al cargar ubicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleUbicacionAgregada = () => {
    cargarUbicaciones();
    setShowAddModal(false);
    toast.success('Ubicación agregada correctamente');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-600" />
            Mis Ubicaciones
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus direcciones para recibir productos cerca de ti
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Ubicación
        </button>
      </div>

      {ubicaciones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No tienes ubicaciones registradas
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega una ubicación para ver productos disponibles en tu zona
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Agregar Primera Ubicación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ubicaciones.map((ubicacion, index) => (
            <UbicacionCard 
              key={ubicacion.idubicacion || index} 
              ubicacion={ubicacion} 
              onUpdate={cargarUbicaciones}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AgregarUbicacionModal
          onClose={() => setShowAddModal(false)}
          onUbicacionAgregada={handleUbicacionAgregada}
          userEmail={usuario.email}
        />
      )}
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const UbicacionCard = ({ ubicacion, onUpdate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">
            {ubicacion.ubicacion || 'Mi Ubicación'}
          </h3>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{ubicacion.ciudad}, {ubicacion.distrito}</span>
        </div>
        <div className="text-xs text-gray-500">
          Lat: {ubicacion.latitud?.toFixed(6)}, 
          Lng: {ubicacion.longitud?.toFixed(6)}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Activa
          </span>
        </div>
      </div>
    </div>
  );
};

// Modal para agregar nueva ubicación
const AgregarUbicacionModal = ({ onClose, onUbicacionAgregada, userEmail }) => {
  const [formData, setFormData] = useState({
    ubicacion: '',
    latitud: '',
    longitud: ''
  });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBgGNXF0P28UyZUTKfcrQu3UKZfWUEpMEU"
  });

  const mapCenter = {
    lat: -14.089864163920964,
    lng: -75.74606562072026
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setSelectedPosition({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitud: lat,
      longitud: lng
    }));
  };

  const getCurrentLocation = () => {
    setUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setSelectedPosition({ lat, lng });
          setFormData(prev => ({
            ...prev,
            latitud: lat,
            longitud: lng
          }));
          setUseCurrentLocation(false);
          toast.success('Ubicación actual obtenida');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('No se pudo obtener la ubicación actual');
          setUseCurrentLocation(false);
        }
      );
    } else {
      toast.error('Geolocalización no soportada');
      setUseCurrentLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitud || !formData.longitud) {
      toast.error('Por favor selecciona una ubicación en el mapa');
      return;
    }

    if (!formData.ubicacion.trim()) {
      toast.error('Por favor ingresa una descripción para la ubicación');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        email: userEmail,
        ubicacion: formData.ubicacion.trim(),
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud)
      };

      await api.post('/ubicacion-usuario/agregar', requestData);
      onUbicacionAgregada();
    } catch (error) {
      console.error('Error al agregar ubicación:', error);
      const errorMessage = error.response?.data?.mensaje || error.response?.data || 'Error al agregar ubicación';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Agregar Nueva Ubicación</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la ubicación *
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              placeholder="Ej: Mi casa, Oficina, Casa de mis padres"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona la ubicación en el mapa *
            </label>
            
            <div className="mb-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={useCurrentLocation || loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <MapPin className="w-4 h-4" />
                {useCurrentLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '300px' }}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={selectedPosition || mapCenter}
                zoom={selectedPosition ? 16 : 12}
                onClick={handleMapClick}
              >
                {selectedPosition && (
                  <Marker position={selectedPosition} />
                )}
              </GoogleMap>
            </div>

            {selectedPosition && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <Check className="w-4 h-4 inline mr-1" />
                  Ubicación seleccionada: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !selectedPosition}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {loading ? 'Guardando...' : 'Guardar Ubicación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbicacionManager;