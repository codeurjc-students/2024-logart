import React, { useState, useContext, useEffect } from 'react';
import api from '../utilities/api';
import { ModalContext } from '../context/ModalContext';

const EditObject = ({ object, disciplines, onObjectUpdated }) => {
  const { closeModal } = useContext(ModalContext); 
  const [name, setName] = useState(object.name);
  const [description, setDescription] = useState(object.description || '');
  const [disciplineName, setDisciplineName] = useState(object.disciplineName || (disciplines.length > 0 ? disciplines[0].name : ''));
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(object.name);
    setDescription(object.description || '');
    setDisciplineName(object.disciplineName || (disciplines.length > 0 ? disciplines[0].name : ''));
  }, [object, disciplines]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!disciplineName.trim()) {
      setError('La disciplina es obligatoria.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('disciplineName', disciplineName);
      if (image) {
        formData.append('imageUrl', image);
      }

      const response = await api.put(`api/v1/objects/${object._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setName('');
      setDescription('');
      setDisciplineName(disciplines.length > 0 ? disciplines[0].name : '');
      setImage(null);

      closeModal();

      onObjectUpdated(response.data.object); 
    } catch (err) {
      console.error('Error al editar objeto:', err);
      setError(err.response?.data?.message || 'Error al editar objeto.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Editar Objeto</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-950 font-medium mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              data-testid="edit-object-name"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded text-gray-700 font-medium"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-950 font-medium mb-2">
              Descripción:
            </label>
            <textarea
              id="description"
              value={description}
              data-testid="edit-object-description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded text-gray-700 font-medium"
              rows="4"
            ></textarea>
          </div>

          <div className="mb-4 ">
            <label htmlFor="discipline" className="block text-gray-950 font-medium mb-2">
              Disciplina:
            </label>
            <select
              id="discipline"
              value={disciplineName}
              data-testid="edit-object-discipline"
              onChange={(e) => setDisciplineName(e.target.value)}
              className="w-full p-2 border rounded text-gray-700 font-medium"
              required
            >
              {disciplines.map((discipline) => (
                <option key={discipline._id} value={discipline.name}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-950 font-medium">
              Imagen (dejar en blanco para mantener la actual):
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              data-testid="edit-object-imageUrl"
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              data-testid="edit-object-submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Editando...' : 'Editar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditObject;
