import slider1 from "../assets/slider1.jpg";
import slider2 from "../assets/slider2.jpg";
import { useState } from "react";

const slides = [slider1, slider2];

const Slider = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex((index - 1 + slides.length) % slides.length);

  return (
    <div className="w-[90vw] max-w-[3000px] mx-auto my-10 relative h-[700px] rounded-lg overflow-hidden shadow-lg">
     <img
        src={slides[index]}
        alt="slider"
        className="w-full h-full object-cover transition-transform duration-800 ease-in-out"
        style={{ transform: "scale(1.05)" }}
      />

      
      <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-center items-start px-16 md:px-24 lg:px-32 text-white z-20">
        <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
          Nuevos Productos
        </h2>
        <p className="mt-4 text-lg md:text-xl max-w-xl drop-shadow-md">
          Conoce los nuevos productos que llegaron a nuestras sucursales
        </p>
        <a
          href="/productos"
          className="mt-8 inline-block bg-purple-600 hover:bg-purple-700 transition-colors px-8 py-3 rounded-full font-semibold shadow-lg"
        >
          Explorar Productos
        </a>
      </div>
      

      {/* Botones de slider */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/4 bg-white bg-opacity-10 hover:bg-opacity-70 text-black rounded-full w-12 h-12 flex justify-center items-center text-3xl shadow-md transition z-30"
        aria-label="Anterior"
      >
        &#8249;
      </button>

      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/4 bg-white bg-opacity-10 hover:bg-opacity-70 text-black rounded-full w-12 h-12 flex justify-center items-center text-3xl shadow-md transition z-30"
        aria-label="Siguiente"
      >
        &#8250;
      </button>
    </div>
  );
};

export default Slider;
