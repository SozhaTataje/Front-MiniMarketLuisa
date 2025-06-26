import React from 'react';
import { Package, Store, List, CheckCircle, XCircle } from 'lucide-react';

const EstadisticasDashboard = ({ resumen }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <CardStat title="Productos" value={resumen.totalProductos} icon={<Package className="text-blue-600" />} />
      <CardStat title="Sucursales" value={resumen.totalSucursales} icon={<Store className="text-purple-600" />} />
      <CardStat title="Asignaciones" value={resumen.totalAsignaciones} icon={<List className="text-green-600" />} />
      <CardStat title="Activos" value={resumen.totalActivos} icon={<CheckCircle className="text-green-600" />} />
      <CardStat title="Inactivos" value={resumen.totalInactivos} icon={<XCircle className="text-red-600" />} />
    </div>
  );
};

const CardStat = ({ title, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);

export default EstadisticasDashboard;
