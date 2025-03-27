import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate("/disciplines");
    } else {
      setError(result.message);
    }
  };
  return (
    <section>
      <div className=" min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-950 via-blue-600 to-blue-900 opacity-90">
        <div
          className="bg-transparent bg-gradient-to-r from-white/10 to-black/25 p-8 rounded-lg shadow-lg border border-gray-400 shadow-black"
          style={{ backgroundSize: "40px" }}
        >
          <h2 className="text-3xl mb-6 text-white  text-center font-medium">
            Iniciar Sesión
          </h2>
          {error && (
            <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-white ">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                data-testid="login-email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/90 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-950 font-medium"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Contraseña</label>
              <input
                type="password"
                value={password}
                data-testid="login-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/90 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-950 font-medium"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black-100 opacity-90 text-white py-2 rounded hover:bg-purple-700 transition-colors duration-300 base-bold"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="mt-4 text-center text-white">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-purple-300 hover:underline font-medium"
            >
              Registrarse
            </Link>
          </p>
          <p className="mt-4 text-center text-white">
            ¿Olvidaste la contraseña?{" "}
            <Link
              to="/forgot-password"
              className="text-purple-300 hover:text-white transition"
            >
              Recuperar contraseña
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
