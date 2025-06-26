import React, { useEffect, useState } from 'react';
import { 
  X, Store, Package, AlertCircle, CheckCircle, 
  Plus, RefreshCw, MapPin, Edit3, Info 
} from 'lucide-react';
import api from '../../../../api/axiosInstance';

const GestionarSucursalesModal = ({ isOpen, onClose, producto, sucursales, onSuccess }) => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cambiosPendientes, setCambiosPendientes] = useState({});
  const [modoEdicion, setModoEdicion] = useState({});

  useEffect(() => {
    if (producto?.idproducto && isOpen) {
      cargarAsignaciones();
    }
  }, [producto, isOpen]);

  const cargarAsignaciones = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/productosucursal/sucursal/${producto.idproducto}`);
      setAsignaciones(data);
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
      setAsignaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const actualizarStock = async (idSucursal, cantidad) => {
    if (cantidad < 0) return;

    setGuardando(true);
    try {
      await api.put('/productosucursal/stock/actualizar', {
        idProducto: producto.idproducto,
        idSucursal,
        stock: cantidad
      });

      setAsignaciones(prev =>
        prev.map(asig =>
          asig.sucursal.idsucursal === idSucursal ? { ...asig, stock: cantidad } : asig
        )
      );

      setCambiosPendientes(prev => {
        const nuevos = { ...prev };
        delete nuevos[idSucursal];
        return nuevos;
      });

      onSuccess('Stock actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    } finally {
      setGuardando(false);
    }
  };

  const agregarSucursal = async (idSucursal, stockInicial = 0) => {
    setGuardando(true);
    try {
      await api.post('/productosucursal/agregar', {
        producto: producto.idproducto,
        sucursal: idSucursal,
        stock: stockInicial
      });
      await cargarAsignaciones();
      onSuccess('Producto agregado a sucursal');
    } catch (error) {
      console.error('Error al agregar sucursal:', error);
    } finally {
      setGuardando(false);
    }
  };

  const toggleModoEdicion = (idSucursal) => {
    setModoEdicion(prev => ({ ...prev, [idSucursal]: !prev[idSucursal] }));
  };

  const handleStockChange = (idSucursal, nuevoStock) => {
    setCambiosPendientes(prev => ({ ...prev, [idSucursal]: parseInt(nuevoStock) || 0 }));
  };

  const guardarCambio = (idSucursal) => {
    const nuevoStock = cambiosPendientes[idSucursal];
    if (nuevoStock !== undefined) {
      actualizarStock(idSucursal, nuevoStock);
      toggleModoEdicion(idSucursal);
    }
  };

  const cancelarCambio = (idSucursal) => {
    setCambiosPendientes(prev => {
      const nuevos = { ...prev };
      delete nuevos[idSucursal];
      return nuevos;
    });
    toggleModoEdicion(idSucursal);
  };

  const estadisticas = {
    totalStock: asignaciones.reduce((acc, asig) => acc + (asig.stock || 0), 0),
    totalReservado: asignaciones.reduce((acc, asig) => acc + (asig.stockReservado || 0), 0),
    sucursalesActivas: asignaciones.filter(asig => asig.activo).length,
    totalSucursales: Array.isArray(sucursales) ? sucursales.length : 0,
    sucursalesAsignadas: asignaciones.length
  };

  const sucursalesDisponibles = Array.isArray(sucursales)
    ? sucursales.filter(
        (suc) => !asignaciones.some((asig) => asig.sucursal.idsucursal === suc.idsucursal)
      )
    : [];

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl mx-4 rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex gap-3 items-center">
            <div className="bg-green-100 p-2 rounded-xl">
              <Store className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-xl">Gestionar Stock por Sucursal</h2>
              <div className="flex gap-2 items-center text-sm text-gray-500">
                <Package className="w-4 h-4" />
                {producto.nombre}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cargarAsignaciones}
              className="text-gray-500 hover:text-blue-600 p-2 rounded-lg"
              disabled={loading}
              title="Actualizar"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-gray-50 p-4 border-b text-sm grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatBox label="Stock Total" value={estadisticas.totalStock} color="blue" />
          <StatBox label="Reservado" value={estadisticas.totalReservado} color="orange" />
          <StatBox label="Asignadas" value={estadisticas.sucursalesAsignadas} color="green" />
          <StatBox label="Activas" value={estadisticas.sucursalesActivas} color="purple" />
          <StatBox label="Disponibles" value={sucursalesDisponibles.length} color="gray" />
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Sucursales asignadas */}
          {asignaciones.map(asignacion => {
            const suc = asignacion.sucursal;
            const enEdicion = modoEdicion[suc.idsucursal];
            const stockActual = asignacion.stock || 0;
            const stockReservado = asignacion.stockReservado || 0;
            const stockDisponible = stockActual - stockReservado;
            const valorPendiente = cambiosPendientes[suc.idsucursal];

            return (
              <div key={suc.idsucursal} className="p-4 bg-white border rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{suc.nombre}</h4>
                      <p className="text-sm text-gray-500">{suc.ciudad}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-600">
                        <span>Stock: {stockActual}</span>
                        {stockReservado > 0 && <span>Reservado: {stockReservado}</span>}
                        <span>Disponible: {stockDisponible}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {enEdicion ? (
                      <>
                        <input
                          type="number"
                          defaultValue={valorPendiente ?? stockActual}
                          min="0"
                          onChange={e => handleStockChange(suc.idsucursal, e.target.value)}
                          className="border px-2 py-1 w-20 rounded text-center"
                        />
                        <button
                          onClick={() => guardarCambio(suc.idsucursal)}
                          disabled={guardando}
                          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cancelarCambio(suc.idsucursal)}
                          className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => toggleModoEdicion(suc.idsucursal)}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <div className={`p-2 rounded-full ${asignacion.activo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {asignacion.activo ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Sucursales disponibles */}
          {sucursalesDisponibles.length > 0 && (
            <div>
              <h3 className="font-medium text-lg mb-2 flex gap-2 items-center">
                <Plus className="w-5 h-5 text-blue-600" />
                Sucursales Disponibles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sucursalesDisponibles.map(suc => (
                  <div key={suc.idsucursal} className="p-4 bg-gray-50 border rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{suc.nombre}</h4>
                      <p className="text-sm text-gray-500">{suc.ciudad}</p>
                    </div>
                    <button
                      onClick={() => agregarSucursal(suc.idsucursal)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      disabled={guardando}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600 bg-gray-50">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Los cambios se guardan automáticamente</span>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color }) => (
  <div className="bg-white rounded-lg p-3 text-center">
    <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default GestionarSucursalesModal;
