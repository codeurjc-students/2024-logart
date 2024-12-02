import React, { useState } from 'react';
import api from '../utilities/api';

const EditObject = ({ object, onClose, onObjectUpdated }) => {
  const [name, setName] = useState(object.name);
  const [description, setDescription] = useState(object.description);
  const [disciplineName, setDisciplineName] = useState(object.discipline.name);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('disciplineName', disciplineName);
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    try {
      const response = await api.put(`api/v1/objects/${object._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      onObjectUpdated(response.data.object);
      onClose();
      alert('Objeto actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar el objeto:', error);
      setLoading(false);
      setError(error.response?.data?.message || 'Error al actualizar el objeto.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
        <h2 className="text-2xl font-bold mb-4">Editar Objeto</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Descripción:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 border rounded"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label htmlFor="discipline" className="block text-gray-700 mb-2">
              Disciplina:
            </label>
            <input
              type="text"
              id="discipline"
              value={disciplineName}
              onChange={(e) => setDisciplineName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-gray-700 mb-2">
              Imagen:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full"
            />
            {object.imageUrl && !imageFile && (
              <img 
                src={object.imageUrl.startsWith('http') ? object.imageUrl : `http://localhost:443/${object.imageUrl}`} 
                alt={object.name} 
                className="mt-2 w-full h-32 object-cover rounded"
              />
            )}
            {imageFile && (
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Preview" 
                className="mt-2 w-full h-32 object-cover rounded"
              />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded ${
                loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditObject;
