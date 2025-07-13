import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UbicacionContext = createContext();

export const UbicacionProvider = ({ children }) => {
  const { usuario } = useAuth();
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);
  const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);

  // Cargar ubicación guardada en localStorage al inicializar
  useEffect(() => {
    if (usuario?.email) {
      const ubicacionGuardada = localStorage.getItem(`ubicacion_${usuario.email}`);
      if (ubicacionGuardada) {
        try {
          const ubicacion = JSON.parse(ubicacionGuardada);
          setUbicacionSeleccionada(ubicacion);
        } catch (error) {
          console.error('Error al cargar ubicación guardada:', error);
        }
      }
    }
  }, [usuario]);

  // Guardar ubicación en localStorage cuando cambie
  useEffect(() => {
    if (usuario?.email && ubicacionSeleccionada) {
      localStorage.setItem(`ubicacion_${usuario.email}`, JSON.stringify(ubicacionSeleccionada));
    }
  }, [ubicacionSeleccionada, usuario]);

  const cambiarUbicacion = (nuevaUbicacion) => {
    setUbicacionSeleccionada(nuevaUbicacion);
  };

  const actualizarSucursalesDisponibles = (sucursales) => {
    setSucursalesDisponibles(sucursales);
  };

  const limpiarUbicacion = () => {
    setUbicacionSeleccionada(null);
    setSucursalesDisponibles([]);
    if (usuario?.email) {
      localStorage.removeItem(`ubicacion_${usuario.email}`);
    }
  };

  return (
    <UbicacionContext.Provider 
      value={{
        ubicacionSeleccionada,
        sucursalesDisponibles,
        cambiarUbicacion,
        actualizarSucursalesDisponibles,
        limpiarUbicacion
      }}
    >
      {children}
    </UbicacionContext.Provider>
  );
};

export const useUbicacion = () => {
  const context = useContext(UbicacionContext);
  if (!context) {
    throw new Error('useUbicacion debe ser usado dentro de un UbicacionProvider');
  }
  return context;
}; 