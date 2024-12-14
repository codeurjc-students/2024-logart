import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utilities/api";
import { AuthContext } from "../context/AuthContext";
import CommentList from "../components/CommentList";
import AddComment from "../components/AddComment";

const ObjectDetail = () => {
  const { objectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshComments, setRefreshComments] = useState(false);
  useEffect(() => {
    const fetchObject = async () => {
      try {
        const response = await api.get(`/api/v1/objects/details/${objectId}`);
        setObject(response.data.object);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching object details:", err);
        setError(
          err.response?.data?.message ||
            "Error al obtener los detalles del objeto"
        );
        setLoading(false);
      }
    };
    fetchObject();
  }, [objectId]);
  const handleCommentAdded = () => {
    setRefreshComments((prev) => !prev);
  };
  if (loading)
    return <div className="text-center mt-10 text-gray-700">Cargando...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!object)
    return (
      <div className="text-center mt-10 text-gray-700">
        Objeto no encontrado
      </div>
    );
  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-950 via-blue-600 to-blue-900 opacity-90 py-10">
      <div className="pt-14">
        {" "}
        <div className="pt-10"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="lg:w-1/2 bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col">
              <div>
                <img
                  src={
                    object.imageUrl.startsWith("http")
                      ? object.imageUrl
                      : `https://localhost:443/${object.imageUrl}`
                  }
                  alt={object.name}
                  className="w-full h-auto rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {object.name}
                </h1>
                <p className="text-gray-700 mb-4">{object.description}</p>
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">
                    Disciplina:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {object.discipline ? object.discipline.name : "N/A"}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">
                    Creado por:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {object.createdBy
                      ? `${object.createdBy.firstName} ${object.createdBy.lastName} (${object.createdBy.username})`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 bg-white rounded-lg shadow-md p-6 mt-6 lg:mt-0">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Comentarios
            </h2>
            {isAuthenticated ? (
              <AddComment
                objectId={objectId}
                onCommentAdded={handleCommentAdded}
              />
            ) : (
              <p className="text-gray-600 mb-4">
                Inicia sesión para añadir un comentario.
              </p>
            )}
            <CommentList
              objectId={objectId}
              refresh={refreshComments}
              objectOwnerId={object.createdBy ? object.createdBy._id : null}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObjectDetail;
