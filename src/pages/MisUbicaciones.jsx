// src/pages/MisUbicaciones.jsx
import React from 'react';
import UbicacionManager from '../components/UbicacionManager';
import Footer from '../components/Footer';

const MisUbicaciones = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <UbicacionManager />
      </div>
      <Footer />
    </div>
  );
};

export default MisUbicaciones;