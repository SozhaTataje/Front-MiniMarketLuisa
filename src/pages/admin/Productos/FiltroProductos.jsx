import React from 'react';
import { Filter } from 'lucide-react';

const FiltroProductos = ({
  vistaActual,
  categorias,
  sucursales,
  filtroCategoria,
  setFiltroCategoria,
  filtroNombre,
  setFiltroNombre,
  filtroEstado,
  setFiltroEstado,
  limpiarFiltros,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Filter className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Filtros de {vistaActual === 'productos' ? 'Productos' : 'Productos por Sucursal'}
          </h3>
        </div>
        <button
          onClick={limpiarFiltros}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Limpiar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por categoría o sucursal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {vistaActual === 'productos' ? 'Categoría' : 'Sucursal'}
          </label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">
              {vistaActual === 'productos'
                ? 'Todas las categorías'
                : 'Todas las sucursales'}
            </option>
            {(Array.isArray(vistaActual === 'productos' ? categorias : sucursales) ?
              (vistaActual === 'productos' ? categorias : sucursales) : []).map((item) => (
              <option
                key={vistaActual === 'productos' ? item.id : item.idsucursal}
                value={vistaActual === 'productos' ? item.id : item.idsucursal}
              >
                {vistaActual === 'productos'
                  ? item.name
                  : `${item.nombre} - ${item.ciudad}`}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltroProductos;