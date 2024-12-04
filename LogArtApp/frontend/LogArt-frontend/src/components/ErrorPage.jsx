import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  const handle = () => {
    navigate("/disciplines");
  };

  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-950 via-blue-400 to-blue-900 opacity-90 py-10 relative">
      <div className="text-center mt-40 -ml-40 max-lg:mt-20 max-lg:ml-0">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404-error</h1>
        <p className="text-xl text-gray-700 mb-4">PAGINA NO ENCONTRADA</p>
        <p className="text-lg text-gray-600 font-medium mb-8">Tu creatividad te ha llevado demasiado lejos</p>
        <button
          onClick={() => handle()}
          className="px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-orange-400 text-gray-800 focus:outline-none"
        >
          Volver
        </button>
      </div>
      <div className="fixed bottom-0 right-0 ">
        <img
          src="/images/bat1.png"
          alt="Batman looking sad"
          className="w-640 max-lg:hidden"
        />
      </div>
    </div>
  );
};

export default Error404;
