import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utilities/api'; 
import { AuthContext } from '../context/AuthContext'; 
import CommentList from '../components/CommentList';
import AddComment from '../components/AddComment';

const ObjectDetail = () => {
  const { objectId } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshComments, setRefreshComments] = useState(false);
  
  useEffect(() => {
    const fetchObject = async () => {
      try {
        const response = await api.get(`/api/v1/objects/details/${objectId}`);
        setObject(response.data.object);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching object details:', err);
        setError(err.response?.data?.message || 'Error fetching object details');
        setLoading(false);
      }
    };

    fetchObject();
  }, [objectId]);

  const handleCommentAdded = () => {
    setRefreshComments(prev => !prev);
  };

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!object) return <div className="text-center mt-10">Objeto no encontrado</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row">
        
        <div className="md:w-1/2">
          <img src={object.imageUrl} alt={object.name} className="w-full h-auto rounded shadow" />
        </div>
        
        <div className="md:w-1/2 md:pl-6 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold mb-2">{object.name}</h1>
          <p className="text-gray-700 mb-4">{object.description}</p>
          <p className="text-gray-600 mb-2"><strong>Disciplina:</strong> {object.discipline ? object.discipline.name : 'N/A'}</p>
          <p className="text-gray-600"><strong>Creado por:</strong> {object.createdBy ? `${object.createdBy.firstName} ${object.createdBy.lastName} (${object.createdBy.username})` : 'N/A'}</p>
        </div>
      </div>

      
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comentarios</h2>
        {isAuthenticated ? (
          <AddComment objectId={objectId} onCommentAdded={handleCommentAdded} />
        ) : (
          <p className="text-gray-600 mb-4">Inicia sesión para añadir un comentario.</p>
        )}
        <CommentList 
          objectId={objectId} 
          refresh={refreshComments} 
          objectOwnerId={object.createdBy._id} 
        />
      </div>
    </div>
  );
};

export default ObjectDetail;
