import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../utilities/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/verify/${token}`);
        setSuccess(true);
        setError("");
      } catch (err) {
        if (err.response?.data?.message?.includes("already verified")) {
          setSuccess(true);
          setError("");
        } else {
          setSuccess(false);
          setError(
            err.response?.data?.message ||
              "No se pudo verificar tu correo electrónico. El enlace puede ser inválido o haber expirado."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-950 via-blue-800 to-blue-900 px-4 py-20">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-gray-400">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Verificación de Correo Electrónico
        </h2>
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        {!loading && success && (
          <div className="bg-green-100/70 text-green-800 p-4 rounded-md mb-6">
            <p className="text-center text-lg font-medium">
              ¡Tu correo electrónico ha sido verificado correctamente!
            </p>
            <p className="text-center mt-2">
              Ya puedes iniciar sesión en tu cuenta.
            </p>
          </div>
        )}
        {!loading && error && (
          <div className="bg-red-100/70 text-red-800 p-4 rounded-md mb-6">
            <p className="text-center font-medium">{error}</p>
          </div>
        )}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
