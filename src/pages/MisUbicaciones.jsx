import React from 'react';
import UbicacionManager from '../components/UbicacionManager';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const MisUbicaciones = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> 
      <div className="py-8">
        <UbicacionManager />
      </div>
      <Footer />
    </div>
  );
};

export default MisUbicaciones;
