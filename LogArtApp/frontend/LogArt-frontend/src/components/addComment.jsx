import React, { useState } from 'react';
import api from '../utilities/api';

const AddComment = ({ objectId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('El contenido del comentario no puede estar vacío.');
      return;
    }

    try {
      await api.post('api/v1/comments', { content, objectId });
      setContent('');
      setError('');
      setSuccess('Comentario añadido exitosamente.');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Error añadiendo comentario:', err);
      setError(err.response?.data?.message || 'Error añadiendo comentario.');
      setSuccess('');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          className="w-full p-2 border rounded mb-2"
          rows="4"
          required
        ></textarea>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Añadir Comentario</button>
      </form>
    </div>
  );
};

export default AddComment;
