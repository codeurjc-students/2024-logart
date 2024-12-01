// src/pages/ObjectDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utilities/api';
import { AuthContext } from '../context/AuthContext';

const ObjectDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [object, setObject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const response = await axios.get(`/api/v1/objects/${id}`);
        setObject(response.data.object);
      } catch (error) {
        console.error('Error al obtener el objeto:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/v1/comments/object/${id}`);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    fetchObject();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    try {
      const response = await axios.post('/api/v1/comments', {
        content: newComment,
        objectId: id,
      });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      setMessage('Comentario creado exitosamente');
      setError('');
    } catch (error) {
      console.error('Error al crear comentario:', error);
      setError(error.response?.data?.message || 'Error al crear comentario');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/v1/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      setMessage('Comentario eliminado');
      setError('');
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      setError(error.response?.data?.message || 'Error al eliminar comentario');
    }
  };

  const handleEditComment = async (commentId, updatedContent) => {
    try {
      const response = await axios.put(`/api/v1/comments/${commentId}`, { content: updatedContent });
      setComments(comments.map(comment => comment._id === commentId ? response.data.comment : comment));
      setMessage('Comentario actualizado');
      setError('');
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      setError(error.response?.data?.message || 'Error al actualizar comentario');
    }
  };

  if (!object) return <div>Cargando...</div>;

  return (
    <div>
      <div className="mb-6">
        <img src={`http://localhost:5000${object.imageUrl}`} alt={object.name} className="w-full h-64 object-cover rounded" />
        <h1 className="text-3xl mt-4">{object.name}</h1>
        <p className="text-gray-700">Disciplina: {object.discipline.name}</p>
        {/* Agrega más detalles del objeto según tu modelo */}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl mb-4">Comentarios</h2>
        {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}
        {message && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{message}</div>}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              className="w-full border p-2 rounded mb-2" 
              placeholder="Escribe tu comentario..." 
              rows="3"
              required
            ></textarea>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Publicar Comentario</button>
          </form>
        ) : (
          <p>Inicia sesión para comentar.</p>
        )}

        <div>
          {comments.map(comment => (
            <div key={comment._id} className="border p-4 rounded mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{comment.user.username}</span>
                  <span className="text-gray-600 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                {(isAuthenticated && (user._id === comment.user._id || user.role === 'admin')) && (
                  <div>
                    {/* Implementa botones para editar/eliminar */}
                    <button 
                      onClick={() => handleDeleteComment(comment._id)} 
                      className="text-red-500 mr-2"
                    >
                      Eliminar
                    </button>
                    {/* Implementa funcionalidad de edición si lo deseas */}
                  </div>
                )}
              </div>
              <p className="mt-2">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObjectDetail;
