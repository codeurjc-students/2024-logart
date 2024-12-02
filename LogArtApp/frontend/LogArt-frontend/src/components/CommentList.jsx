import React, { useState, useEffect } from 'react';
import api from '../utilities/api';

const CommentList = ({ objectId, refresh, objectOwnerId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;
  
  const fetchComments = async (page=1) => {
    setLoading(true);
    try {
      const response = await api.get(`api/v1/comments/${objectId}?page=${page}&limit=${limit}`);
      setComments(response.data.comments);
      const totalComments = response.data.totalComments;
      setTotalPages(Math.ceil(totalComments / limit));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.response?.data?.message || 'Error fetching comments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [objectId, currentPage]);

  useEffect(() => {
      fetchComments(currentPage);
  }, [refresh, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  if (loading) return <div>Cargando comentarios...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (comments.length === 0) return <div>No hay comentarios aún.</div>;

  return (
    <div>
      <div className="space-y-4">
        {comments.map(comment => {
          const isAdmin = comment.user.role === 'admin';
          const isNotObjectOwner = comment.user._id !== objectOwnerId;
          const isAdminCommentOnOtherUser = isAdmin && isNotObjectOwner;

          return (
            <div 
              key={comment._id} 
              className={`p-4 rounded shadow ${
                isAdminCommentOnOtherUser ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-gray-100'
              }`}
            >
              <p className="text-gray-800">{comment.content}</p>
              <p className="text-gray-500 text-sm mt-2">
                Por: {comment.user.username} el {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
          }`}
        >
          Anterior
        </button>
        <span className="px-4 py-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CommentList;
