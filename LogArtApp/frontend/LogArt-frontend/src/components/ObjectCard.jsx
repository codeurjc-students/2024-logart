// src/components/ObjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ObjectCard = ({ object }) => {

  const imageUrl = object.imageUrl; 
      console.log(object);


  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
      <Link to={`/objects/${object._id}`}>
        <img src={imageUrl} alt={object.name} className="w-full h-48 object-cover" />
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
          Disciplina: {object.discipline.name}
        </p>
        <p className="text-gray-500 text-sm">
          Creado por: {object.createdBy.firstName} {object.createdBy.lastName}
        </p>
      </div>
    </div>
  );
};

export default ObjectCard;
