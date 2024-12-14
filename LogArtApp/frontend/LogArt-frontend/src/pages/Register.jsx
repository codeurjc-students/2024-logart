import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(
      username,
      email,
      password,
      firstName,
      lastName
    );
    if (result.success) {
      setMessage(result.message);
      setError("");
      navigate("/login");
    } else {
      setError(result.message);
      setMessage("");
    }
  };
  return (
    <section>
      <div className="min-h-screen pt-24 flex flex-col items-center justify-start bg-gradient-to-r from-blue-950 via-blue-600 to-blue-900 opacity-90">
        <div className="pt-5"></div>
        <div
          className="bg-transparent bg-gradient-to-r from-white/10 to-black/25 p-8 rounded-lg shadow-lg border border-gray-400 shadow-black"
          style={{ backgroundSize: "40px" }}
        >
          <h2 className="text-3xl mb-6 text-white text-center font-medium">
            Registrarse
          </h2>
          {error && (
            <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-white">Nombre de Usuario</label>
              <input
                type="text"
                value={username}
                data-testid="register-userName"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                data-testid="register-email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Nombre</label>
              <input
                type="text"
                value={firstName}
                data-testid="register-firstName"
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Apellido</label>
              <input
                type="text"
                value={lastName}
                data-testid="register-lastName"
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Contraseña</label>
              <input
                type="password"
                value={password}
                data-testid="register-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-mediumf"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black-100 opacity-90 text-white py-2 rounded hover:bg-purple-700 transition-colors duration-300 base-bold"
            >
              Registrarse
            </button>
          </form>
          <p className="mt-4 text-center text-white">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-purple-300 hover:underline font-medium"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
        <div className="pb-10"></div>
      </div>
    </section>
  );
};

export default Register;
