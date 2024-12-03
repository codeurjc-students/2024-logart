import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async() => {
    try{
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">LogArt</Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="mr-4">Perfil</Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Cerrar sesión</button>
              <Link to="/disciplines" className="ml-4">Galerías</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Iniciar sesión</Link>
              <Link to="/register" className="bg-blue-500 px-3 py-1 rounded">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
