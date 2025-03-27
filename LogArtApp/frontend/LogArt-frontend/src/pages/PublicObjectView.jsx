import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../utilities/api";

const PublicObjectView = () => {
  const { shareId } = useParams();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchObject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/objects/shared/${shareId}`);
        setObject(response.data.object);
        setError(null);
      } catch (err) {
        console.error("Error fetching shared object:", err);
        setError("El objeto compartido no existe o ya no está disponible");
      } finally {
        setLoading(false);
      }
    };
    if (shareId) {
      fetchObject();
    }
  }, [shareId]);
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center bg-gradient-to-r from-blue-950 via-blue-800 to-blue-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-r from-blue-950 via-blue-800 to-blue-900 px-4">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-gray-400">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            Enlace no válido
          </h2>
          <p className="text-center text-white mb-6">{error}</p>
          <div className="text-center">
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Ir a la página principal
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (!object) return null;
  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-r from-blue-950 via-blue-800 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-400">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-700 text-xs text-white px-2 py-1 rounded">
              Contenido compartido
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">{object.name}</h1>
          <Link to="/" className="text-blue-300 hover:text-white text-3xl">
            Descubre LogArt
          </Link>
          <div className="mb-6">
            <img
              src={
                object.imageUrl.startsWith("http")
                  ? object.imageUrl
                  : `https://localhost:8443/${object.imageUrl}`
              }
              alt={object.name}
              className="w-full max-h-96 object-contain rounded"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Descripción
            </h2>
            <p className="text-gray-300">{object.description}</p>
          </div>
          <div className="mb-6">
            <div>
              <span className="text-gray-400">Disciplina:</span>
              <span className="text-white ml-2">{object.discipline.name}</span>
              <div>
                <span className="text-gray-400">Creado por:</span>
                <span className="text-white ml-2">
                  {object.createdBy.firstName} {object.createdBy.lastName}
                </span>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sxl">
              Este contenido ha sido compartido públicamente por el propietario.
              <br />
              Para crear tu propia cuenta y descubrir más contenido, visita
              <Link
                to="/register"
                className="text-blue-300 hover:text-white ml-1"
              >
                LogArt
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicObjectView;
