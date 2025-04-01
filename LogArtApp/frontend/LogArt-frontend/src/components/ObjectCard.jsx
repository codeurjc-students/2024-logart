import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditObject from "./EditObject";
import api from "../utilities/api";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";

const ObjectCard = ({
  object,
  disciplines,
  onObjectUpdated,
  onObjectDeleted,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { openModal } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar "${object.name}"?`
    );
    if (!confirmDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`api/v1/objects/${object._id}`);
      setIsDeleting(false);
      onObjectDeleted(object._id);
      alert("Objeto eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el objeto:", error);
      setIsDeleting(false);
      alert(error.response?.data?.message || "Error al eliminar el objeto.");
    }
  };
  const handleEdit = () => {
    openModal(
      <EditObject
        object={object}
        disciplines={disciplines}
        onObjectUpdated={onObjectUpdated}
      />
    );
  };
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsTogglingFavorite(true);
      const response = await api.post(`/api/v1/objects/${object._id}/favorite`);
      const newFavoriteState = response.data.isFavorite;
      setFavorite(newFavoriteState);
      if (onToggleFavorite) {
        onToggleFavorite(object._id, newFavoriteState);
      }
    } catch (error) {
      console.error("Error al marcar favorito:", error);
      alert("Error al marcar favorito");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 relative">
      <Link to={`/objects/${object._id}`}>
        <img
          src={
            object.imageUrl.startsWith("http")
              ? object.imageUrl
              : `https://localhost:8443/${object.imageUrl}`
          }
          alt={object.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <button
        onClick={handleToggleFavorite}
        disabled={isTogglingFavorite}
        className="absolute top-2 right-2 text-2xl focus:outline-none transition-transform hover:scale-110"
        aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        {favorite ? "❤️" : "🤍"}
      </button>
      <div className="p-4">
        <Link to={`/objects/${object._id}`}>
          <h2
            className="text-xl font-semibold mb-2 hover:underline"
            data-testid="object-name-link"
          >
            {object.name}
          </h2>
        </Link>
        <p className="text-gray-500 mb-2">
          {object.description.length > 100
            ? `${object.description.substring(0, 100)}...`
            : object.description}
        </p>
        <p className="text-gray-400 text-sm">
          Creado por: {object.createdBy.firstName} {object.createdBy.lastName}
        </p>
        <div className="mt-4 flex space-x-2">
          {user && object.createdBy && user._id === object.createdBy._id && (
            <>
              <button
                onClick={handleEdit}
                data-testid="edit-object-button"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                aria-label={`Editar ${object.name}`}
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                data-testid="delete-object-button"
                disabled={isDeleting}
                className={`px-3 py-1 rounded ${
                  isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                aria-label={`Eliminar ${object.name}`}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectCard;
