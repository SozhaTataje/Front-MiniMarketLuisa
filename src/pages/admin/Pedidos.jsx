import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiEye, FiMapPin, FiUser, FiCalendar, FiDollarSign, FiX, FiEdit, FiTrash2 } from "react-icons/fi";

const Pedidos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSucursal, setFilterSucursal] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [editFormData, setEditFormData] = useState({
    estado: "",
    telefono: "",
    email: ""
  });

  const sucursales = ["Sucursal Centro", "Sucursal Norte", "Sucursal Sur"];
  const estados = ["PENDIENTE", "PAGADO", "PREPARANDO", "LISTO_PARA_RECOGER", "ENTREGADO", "CANCELADO"];

  // Cargar pedidos desde el backend
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3600/pedido/all');
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.idpedido.toString().includes(searchTerm.toLowerCase());
    const matchesSucursal = filterSucursal === "" || 
                           (pedido.pedidoProducto && pedido.pedidoProducto.some(pp => 
                             pp.productoSucursal?.sucursal?.nombre === filterSucursal));
    const matchesEstado = filterEstado === "" || pedido.estado === filterEstado;
    
    return matchesSearch && matchesSucursal && matchesEstado;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PENDIENTE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAGADO": return "bg-blue-100 text-blue-800 border-blue-200";
      case "PREPARANDO": return "bg-orange-100 text-orange-800 border-orange-200";
      case "LISTO_PARA_RECOGER": return "bg-purple-100 text-purple-800 border-purple-200";
      case "ENTREGADO": return "bg-green-100 text-green-800 border-green-200";
      case "CANCELADO": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calcularTotal = (pedidoProducto) => {
    return pedidoProducto?.reduce((total, pp) => total + pp.subtotal, 0) || 0;
  };

  const getSucursalFromPedido = (pedidoProducto) => {
    return pedidoProducto?.[0]?.productoSucursal?.sucursal?.nombre || "N/A";
  };

  const handleVerDetalle = (pedido) => {
    setSelectedPedido(pedido);
    setShowDetailModal(true);
  };

  const handleEditarPedido = (pedido) => {
    setSelectedPedido(pedido);
    setEditFormData({
      estado: pedido.estado,
      telefono: pedido.telefono,
      email: pedido.email
    });
    setShowEditModal(true);
  };

  const handleUpdatePedido = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3600/pedido/update/${selectedPedido.idpedido}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        await fetchPedidos(); // Recargar pedidos
        setShowEditModal(false);
        alert('Pedido actualizado exitosamente');
      } else {
        const errorText = await response.text();
        alert(`Error al actualizar: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      alert('Error al actualizar el pedido');
    }
  };

  const handleEliminarPedido = async (idPedido) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3600/pedido/delete/${idPedido}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchPedidos();
          alert('Pedido eliminado exitosamente');
        } else {
          const errorText = await response.text();
          alert(`Error al eliminar: ${errorText}`);
        }
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
        alert('Error al eliminar el pedido');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h1>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Total: {filteredPedidos.length} pedidos
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiFilter className="text-gray-600" />
          Filtros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filterSucursal}
            onChange={(e) => setFilterSucursal(e.target.value)}
          >
            <option value="">Todas las sucursales</option>
            {sucursales.map(sucursal => (
              <option key={sucursal} value={sucursal}>{sucursal}</option>
            ))}
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sucursal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPedidos.map((pedido) => (
                <tr key={pedido.idpedido} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{pedido.idpedido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pedido.nombre} {pedido.apellido}
                        </div>
                        <div className="text-sm text-gray-500">{pedido.email}</div>
                        <div className="text-sm text-gray-500">{pedido.telefono}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiMapPin className="text-gray-400 mr-2" />
                      {getSucursalFromPedido(pedido.pedidoProducto)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <div>
                        <div>{new Date(pedido.fecha).toLocaleDateString()}</div>
                        <div className="text-gray-500">{new Date(pedido.fecha).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <FiDollarSign className="text-gray-400 mr-1" />
                      S/ {calcularTotal(pedido.pedidoProducto).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleVerDetalle(pedido)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        <FiEye /> Ver
                      </button>
                      <button 
                        onClick={() => handleEditarPedido(pedido)}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50"
                      >
                        <FiEdit /> Editar
                      </button>
                      <button 
                        onClick={() => handleEliminarPedido(pedido.idpedido)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50"
                      >
                        <FiTrash2 /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen de Estados */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {estados.map(estado => {
          const count = pedidos.filter(p => p.estado === estado).length;
          return (
            <div key={estado} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{estado}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getEstadoColor(estado)}`}>
                  {count}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle */}
      {showDetailModal && selectedPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Detalle del Pedido #{selectedPedido.idpedido}</h2>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información del Cliente</h3>
                  <div className="space-y-2">
                    <p><strong>Nombre:</strong> {selectedPedido.nombre} {selectedPedido.apellido}</p>
                    <p><strong>Email:</strong> {selectedPedido.email}</p>
                    <p><strong>Teléfono:</strong> {selectedPedido.telefono}</p>
                    <p><strong>Dirección:</strong> {selectedPedido.direccion}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información del Pedido</h3>
                  <div className="space-y-2">
                    <p><strong>Estado:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getEstadoColor(selectedPedido.estado)}`}>
                        {selectedPedido.estado}
                      </span>
                    </p>
                    <p><strong>Fecha del Pedido:</strong> {new Date(selectedPedido.fecha).toLocaleString()}</p>
                    {selectedPedido.fechaderecojo && (
                      <p><strong>Fecha de Recojo:</strong> {new Date(selectedPedido.fechaderecojo).toLocaleString()}</p>
                    )}
                    {selectedPedido.fechapago && (
                      <p><strong>Fecha de Pago:</strong> {new Date(selectedPedido.fechapago).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Productos del Pedido</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Producto</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Sucursal</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Cantidad</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Precio Unit.</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPedido.pedidoProducto?.map((pp, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{pp.productoSucursal?.producto?.nombre || 'N/A'}</td>
                          <td className="px-4 py-2">{pp.productoSucursal?.sucursal?.nombre || 'N/A'}</td>
                          <td className="px-4 py-2">{pp.cantidad}</td>
                          <td className="px-4 py-2">S/ {pp.productoSucursal?.producto?.precio?.toFixed(2) || '0.00'}</td>
                          <td className="px-4 py-2">S/ {pp.subtotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="4" className="px-4 py-2 text-right font-bold">Total:</td>
                        <td className="px-4 py-2 font-bold">S/ {calcularTotal(selectedPedido.pedidoProducto).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Editar Pedido #{selectedPedido.idpedido}</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={editFormData.estado}
                  onChange={(e) => setEditFormData({...editFormData, estado: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  value={editFormData.telefono}
                  onChange={(e) => setEditFormData({...editFormData, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdatePedido}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Actualizar
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;