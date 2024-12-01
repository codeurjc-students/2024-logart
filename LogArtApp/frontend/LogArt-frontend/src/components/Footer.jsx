import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        {new Date().getFullYear()} &copy; LogArt. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer