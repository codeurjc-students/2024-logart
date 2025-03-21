import React, { useState, useEffect, useContext } from "react";
import api from "../utilities/api";
import { AuthContext } from "../context/AuthContext";
import CommentItem from "./CommentItem";

const CommentList = ({ objectId, refresh, objectOwnerId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;
  const { user, isAuthenticated } = useContext(AuthContext);
  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/comments/${objectId}`, {
        params: {
          page,
          limit,
        },
      });
      setComments(response.data.comments);
      const totalComments = response.data.totalComments;
      setTotalPages(Math.ceil(totalComments / limit));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(
        err.response?.data?.message || "Error al obtener los comentarios"
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComments(currentPage);
  }, [objectId, currentPage]);
  useEffect(() => {
    fetchComments(currentPage);
  }, [refresh]);
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const handleCommentUpdated = () => {
    fetchComments(currentPage);
  };
  const handleCommentDeleted = () => {
    if (comments.length === 1 && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else {
      fetchComments(currentPage);
    }
  };
  if (loading)
    return (
      <div className="text-center text-gray-700">Cargando comentarios...</div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (comments.length === 0)
    return (
      <div className="text-center text-gray-700">No hay comentarios aún.</div>
    );
  return (
    <div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
            objectOwnerId={objectOwnerId}
          />
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-800 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
          }`}
        >
          Anterior
        </button>
        <span className="px-4 py-2 text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-800 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CommentList;
