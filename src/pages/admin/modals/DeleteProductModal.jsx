import React, { useState } from "react";
import Modal from "react-modal";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiAlertTriangle, FiX } from "react-icons/fi";

const DeleteProductModal = ({ isOpen, onClose, producto, onProductDeleted, sucursalName }) => {
  const [loading, setLoading] = useState(false);

  // Generar imagen placeholder segura
  const getPlaceholderImage = () => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle" dy=".3em">
          Sin imagen
        </text>
      </svg>
    `)}`;
  };

  const handleDelete = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Extraer IDs con mejor debugging
      const idProducto = producto?.producto?.idproducto || producto?.idproducto;
      const idSucursal = producto?.sucursal?.idsucursal || producto?.idsucursal;

      console.log("Datos para eliminar:", {
        producto,
        idProducto,
        idSucursal,
        productoCompleto: JSON.stringify(producto, null, 2)
      });

      if (!idProducto) {
        throw new Error("No se encontró el ID del producto. Estructura recibida: " + JSON.stringify(producto));
      }
      if (!idSucursal) {
        throw new Error("No se encontró el ID de la sucursal. Estructura recibida: " + JSON.stringify(producto));
      }

      // Probar diferentes formatos de eliminación según tu API
      console.log("Intentando eliminar con parámetros:", { idProducto, idSucursal });

      // Método 1: Con parámetros en URL
      let response;
      try {
        response = await api.delete(`/productosucursal/eliminar?idProducto=${idProducto}&idSucursal=${idSucursal}`);
        console.log("Eliminación exitosa con método 1:", response.data);
      } catch (error1) {
        console.log("Método 1 falló, probando método 2...");
        
        // Método 2: Con params en objeto
        try {
          response = await api.delete("/productosucursal/eliminar", {
            params: {
              idProducto: idProducto,
              idSucursal: idSucursal,
            },
          });
          console.log("Eliminación exitosa con método 2:", response.data);
        } catch (error2) {
          console.log("Método 2 falló, probando método 3...");
          
          // Método 3: Con data en el body
          try {
            response = await api.delete("/productosucursal/eliminar", {
              data: {
                idProducto: idProducto,
                idSucursal: idSucursal,
              },
            });
            console.log("Eliminación exitosa con método 3:", response.data);
          } catch (error3) {
            console.log("Todos los métodos fallaron");
            throw error3;
          }
        }
      }

      alert("Producto eliminado de la sucursal correctamente.");
      
      // Llamar callback para actualizar la lista
      if (onProductDeleted) {
        onProductDeleted();
      }
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error("Error completo al eliminar producto:", error);
      console.error("Response:", error.response);
      console.error("Request config:", error.config);
      
      let errorMsg = "Error al eliminar el producto de la sucursal.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else {
          errorMsg = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !producto) return null;

  const productData = producto.producto || producto;
  const productName = productData?.nombre || "Producto sin nombre";
  const productImage = productData?.imagen;
  const productPrice = productData?.precio;
  const stockAmount = producto.stock ?? 0;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!loading ? onClose : undefined}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4"
      shouldCloseOnOverlayClick={!loading}
      shouldCloseOnEsc={!loading}
    >
      <div className="p-6">
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between mb-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <FiAlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center">
          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Eliminar Producto de Sucursal
          </h3>

          {/* Mensaje de confirmación */}
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <span className="font-semibold text-gray-900">
              "{productName}"
            </span>{" "}
            de la sucursal{" "}
            <span className="font-semibold text-gray-900">
              "{sucursalName || 'Sucursal desconocida'}"
            </span>?
          </p>

          {/* Información del producto */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <img
                src={productImage || getPlaceholderImage()}
                alt={productName}
                className="h-16 w-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = getPlaceholderImage();
                }}
              />
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Stock actual:</span> {stockAmount} unidades
              </p>
              {productPrice && (
                <p>
                  <span className="font-medium">Precio:</span> S/ {Number(productPrice).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start">
              <FiAlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 text-left">
                Esta acción solo eliminará el producto de esta sucursal. 
                El producto seguirá existiendo en otras sucursales donde esté disponible.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                loading 
                  ? "bg-red-400 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <FiTrash2 className="h-4 w-4" />
                  Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteProductModal;