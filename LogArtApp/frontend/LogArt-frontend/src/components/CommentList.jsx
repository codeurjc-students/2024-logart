import React, { useState, useEffect } from 'react';
import api from '../utilities/api';

const CommentList = ({ objectId, refresh }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchComments = async () => {
    try {
      const response = await api.get(`api/v1/comments/${objectId}?page=1&limit=3`);
      setComments(response.data.comments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.response?.data?.message || 'Error fetching comments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [objectId]);

  useEffect(() => {
    if (refresh) {
      fetchComments();
    }
  }, [refresh]);

  if (loading) return <div>Cargando comentarios...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (comments.length === 0) return <div>No hay comentarios aún.</div>;

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment._id} className="p-4 bg-gray-100 rounded shadow">
          <p className="text-gray-800">{comment.content}</p>
          <p className="text-gray-500 text-sm mt-2">Por: {comment.user.username} el {new Date(comment.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
