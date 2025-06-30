import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaStore } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FaStore className="text-yellow-400" />
            <h3 className="text-xl font-bold">Minimarket Luisa</h3>
          </div>
          <p className="text-sm text-purple-100">
            Tu minimarket de confianza, cerca de ti con los mejores productos.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
            <FaPhone className="text-sm" />
            Contacto
          </h4>
          <div className="text-sm space-y-2 text-purple-100">
            <div className="flex items-center gap-2">
              <FaPhone className="text-yellow-400" />
              <span>(+51) 999-999-999</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              <span>ml@minimarketluisa.com</span>
            </div>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-yellow-400 mt-1" />
              <span>Av. Principal 123<br />Ica, Perú</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
            <FaClock className="text-sm" />
            Horarios de Atención
          </h4>
          <div className="text-sm text-purple-100 space-y-2">
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="font-medium">Lunes - Viernes</span>
              <span>9:00 AM - 10:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="font-medium">Sábado</span>
              <span>9:00 AM - 10:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="font-medium">Domingo</span>
              <span className="text-red-300">Cerrado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-purple-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-purple-200">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
