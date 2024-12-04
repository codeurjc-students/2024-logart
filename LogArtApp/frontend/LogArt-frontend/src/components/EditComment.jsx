import React, { useState } from 'react';
import api from '../utilities/api';

const EditComment = ({ comment, onCancel, onSave }) => {
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('El contenido del comentario no puede estar vacío.');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/api/v1/comments/${comment._id}`, { content });
      setSuccess('Comentario actualizado exitosamente.');
      setError('');
      onSave();
    } catch (err) {
      console.error('Error updating comment:', err);
      setError(err.response?.data?.message || 'Error al actualizar el comentario.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="3"
        required
      ></textarea>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <div className="flex space-x-2">
        <button 
          type="submit" 
          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditComment;
