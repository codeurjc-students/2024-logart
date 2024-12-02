import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditObject from './EditObject'; 
import api from '../utilities/api';

const ObjectCard = ({ object, onObjectUpdated, onObjectDeleted }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar "${object.name}"?`);
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`api/v1/objects/${object._id}`);
      setIsDeleting(false);
      onObjectDeleted(object._id);
      alert('Objeto eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el objeto:', error);
      setIsDeleting(false);
      alert(error.response?.data?.message || 'Error al eliminar el objeto.');
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
      <Link to={`/objects/${object._id}`}>
        <img 
          src={object.imageUrl.startsWith('http') ? object.imageUrl : `http://localhost:443/${object.imageUrl}`} 
          alt={object.name} 
          className="w-full h-48 object-cover" 
        />
      </Link>
      <div className="p-4">
        <Link to={`/objects/${object._id}`}>
          <h2 className="text-xl font-semibold mb-2 hover:underline">{object.name}</h2>
        </Link>
        <p className="text-gray-600 mb-2">
          {object.description.length > 100 
            ? `${object.description.substring(0, 100)}...` 
            : object.description
          }
        </p>
        
        <p className="text-gray-500 text-sm">
          Creado por: {object.createdBy.firstName} {object.createdBy.lastName}
        </p>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-3 py-1 rounded ${
              isDeleting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditObject 
          object={object} 
          onClose={() => setIsEditModalOpen(false)} 
          onObjectUpdated={onObjectUpdated} 
        />
      )}
    </div>
  );
};

export default ObjectCard;
