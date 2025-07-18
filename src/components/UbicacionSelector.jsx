import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUbicacion } from '../context/UbicacionContext';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const UbicacionSelector = ({ onUbicacionChange, selectedUbicacionId, className = "" }) => {
  const { usuario } = useAuth();
  const { ubicacionSeleccionada, cambiarUbicacion, actualizarSucursalesDisponibles } = useUbicacion();
  const [ubicaciones, setUbicaciones] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario?.email) {
      cargarUbicaciones();
    }
  }, [usuario]);

  useEffect(() => {
    if (selectedUbicacionId && ubicaciones.length > 0) {
      const ubicacion = ubicaciones.find(u => u.idubicacion_usuario === selectedUbicacionId);
      if (ubicacion) {
        cambiarUbicacion(ubicacion);
        cargarSucursalesPorUbicacion(ubicacion.idubicacion);
      }
    }
  }, [selectedUbicacionId, ubicaciones, cambiarUbicacion]);

  const cargarUbicaciones = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ubicacion-usuario/${usuario.email}`);
      const ubicacionesData = Array.from(response.data) || [];
      setUbicaciones(ubicacionesData);
     
      if (!ubicacionSeleccionada && ubicacionesData.length > 0) {
        const primeraUbicacion = ubicacionesData[0];
        cambiarUbicacion(primeraUbicacion);
        cargarSucursalesPorUbicacion(primeraUbicacion.idubicacion);
        if (onUbicacionChange) {
          onUbicacionChange(primeraUbicacion);
        }
      }
    } catch (error) {
      console.error('Error al cargar ubicaciones:', error);
      toast.error('Error al cargar ubicaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarSucursalesPorUbicacion = async (idUbicacionUsuario) => {
    try {
      const response = await api.get(`/sucursal/usercity/${idUbicacionUsuario}`);
      const sucursalesData = response.data || [];
      actualizarSucursalesDisponibles(sucursalesData);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      toast.error('Error al cargar sucursales para esta ubicación');
    }
  };

  const handleUbicacionSelect = (ubicacion) => {
    cambiarUbicacion(ubicacion);
    setIsOpen(false);
    cargarSucursalesPorUbicacion(ubicacion.idubicacion);
    
    if (onUbicacionChange) {
      onUbicacionChange(ubicacion);
    }
  };

  const getDisplayText = () => {
    if (loading) return 'Cargando ubicaciones...';
    if (!ubicacionSeleccionada) return 'Seleccionar ubicación';
    return `${ubicacionSeleccionada.ubicacion} - ${ubicacionSeleccionada.ciudad}`;
  };

  if (!usuario) {
    return (
      <div className={`bg-gray-100 rounded-lg p-3 text-gray-500 text-sm ${className}`}>
        <MapPin className="w-4 h-4 inline mr-2" />
        Inicia sesión para seleccionar ubicación
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 disabled:opacity-50"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">
            {getDisplayText()}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {ubicaciones.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No tienes ubicaciones registradas</p>
              <a 
                href="/mis-ubicaciones" 
                className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-1 inline-block"
              >
                Agregar ubicación
              </a>
            </div>
          ) : (
            <div className="py-2">
              {ubicaciones.map((ubicacion) => (
                <button
                  key={ubicacion.idubicacion_usuario}
                  onClick={() => handleUbicacionSelect(ubicacion)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">
                        {ubicacion.ubicacion}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ubicacion.ciudad}, {ubicacion.distrito}
                      </p>
                    </div>
                  </div>
                  {ubicacionSeleccionada?.idubicacion_usuario === ubicacion.idubicacion_usuario && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

     
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UbicacionSelector; 