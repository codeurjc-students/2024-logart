import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utilities/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await axios.post("/api/v1/forgot-password", { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ha ocurrido un error. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-950 via-blue-800 to-blue-900 px-4 py-20">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-gray-400">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Recuperar Contraseña
        </h2>
        {message && (
          <div className="bg-green-100/70 text-green-800 p-4 rounded-md mb-6">
            <p>{message}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100/70 text-red-800 p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}
        {!message && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-white mb-2 font-medium"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-blue-950/50 border border-gray-600 rounded text-white"
                placeholder="tu@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-300 hover:text-white transition"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
