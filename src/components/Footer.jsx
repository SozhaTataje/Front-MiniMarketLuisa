const Footer = () => {
  return (
    <footer className="bg-purple-600 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h3 className="text-lg font-bold">Minimarket Luisa</h3>
          <p className="text-sm">
            Siempre cerca de ti con los mejores precios.
          </p>
        </div>
        <div className="text-sm text-center md:text-right mb-4 md:mb-0">
          <p>
            &copy; {new Date().getFullYear()} Minimarket Luisa. Todos los
            derechos reservados.
          </p>
        </div>
        <div className="text-sm font-boldtext-center md:text-right">
          <h3 className=" font-bold mb-1">Contacto</h3>
          <p>Tel: (+51) 999999999</p>
          <p>Email: ml@minimarketluisa.com</p>
        </div>
        <div className="text-sm font-boldtext-center md:text-right">
          <h3 className=" font-bold mb-1">Horarios</h3>
          <p>Lunes: 8:00 AM - 6:00 PM</p>
          <p>Martes: 8:00 AM - 6:00 PM</p>
          <p>Miércoles: 8:00 AM - 6:00 PM</p>
          <p>Jueves: 8:00 AM - 6:00 PM</p>
          <p>Viernes: 8:00 AM - 6:00 PM</p>
          <p>Sábado: 9:00 AM - 2:00 PM</p>
          <p>Domingo: Cerrado</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
