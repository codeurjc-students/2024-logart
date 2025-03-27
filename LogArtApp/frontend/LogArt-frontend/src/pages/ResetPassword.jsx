import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../utilities/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await axios.post(`/api/v1/reset-password/${token}`, {
        password,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
          Establecer Nueva Contraseña
        </h2>
        {message && (
          <div className="bg-green-100/70 text-green-800 p-4 rounded-md mb-6">
            <p>{message}</p>
            <p className="text-sm mt-2">
              Redirigiendo a la página de inicio de sesión...
            </p>
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
                htmlFor="password"
                className="block text-white mb-2 font-medium"
              >
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-2 bg-blue-950/50 border border-gray-600 rounded text-white"
                placeholder="Introduce tu nueva contraseña"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white mb-2 font-medium"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-2 bg-blue-950/50 border border-gray-600 rounded text-white"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </form>
        )}
        {!message && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-300 hover:text-white transition"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;
