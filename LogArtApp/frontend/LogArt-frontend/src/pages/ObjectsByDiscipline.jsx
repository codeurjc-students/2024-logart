import React, { useState, useEffect, useContext } from 'react';
import api from '../utilities/api';
import { AuthContext } from '../context/AuthContext';
import DisciplineSelector from '../components/DisciplineSelector';
import ObjectCard from '../components/ObjectCard';
import CreateObject from '../components/CreateObject';

const ObjectsByDiscipline = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisciplineName, setSelectedDisciplineName] = useState('');
  const [objects, setObjects] = useState([]);
  const [loadingDisciplines, setLoadingDisciplines] = useState(true);
  const [loadingObjects, setLoadingObjects] = useState(false);
  const [errorDisciplines, setErrorDisciplines] = useState('');
  const [errorObjects, setErrorObjects] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = isAuthenticated && user ? user._id : null;

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await api.get('/api/v1/disciplines');
        setDisciplines(response.data.disciplines);
        if (response.data.disciplines.length > 0) {
          setSelectedDisciplineName(response.data.disciplines[2].name);
        }
        setLoadingDisciplines(false);
      } catch (error) {
        console.error('Error al obtener disciplinas:', error);
        setErrorDisciplines(error.response?.data?.message || 'Error al obtener disciplinas');
        setLoadingDisciplines(false);
      }
    };

    fetchDisciplines();
  }, []);

  useEffect(() => {
    if (selectedDisciplineName && userId) {
      fetchObjects(selectedDisciplineName, userId, currentPage);
    }
  }, [selectedDisciplineName, userId, currentPage]);

  const fetchObjects = async (disciplineName, userId, page) => {
    setLoadingObjects(true);
    try {
      const response = await api.get(`api/v1/objects/${encodeURIComponent(disciplineName)}`, {
        params: {
          userId,
          page,
          limit,
        },
      });
      setObjects(response.data.objects);
      setTotalPages(response.data.totalPages);
      setLoadingObjects(false);
    } catch (error) {
      console.error('Error al obtener objetos:', error);
      setErrorObjects(error.response?.data?.message || 'Error al obtener objetos');
      setLoadingObjects(false);
    }
  };

  const handleDisciplineChange = (disciplineName) => {
    setSelectedDisciplineName(disciplineName);
    setCurrentPage(1); 
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleObjectCreated = () => {
    fetchObjects(selectedDisciplineName, userId, currentPage);
  }

  const handleObjectUpdated = (updatedObject) => {
    setObjects((prevObjects) =>
      prevObjects.map((object) => (object._id === updatedObject._id ? updatedObject : object))
    );
  };

  const handleObjectDeleted = (deletedObjectId) => {
    setObjects((prevObjects) => prevObjects.filter((object) => object._id !== deletedObjectId));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Objetos por Disciplina</h1>
      <button onClick={openModal} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Crear Objeto</button>
      <div className="mb-6">
        {loadingDisciplines ? (
          <div>Cargando disciplinas...</div>
        ) : errorDisciplines ? (
          <div className="text-red-500">{errorDisciplines}</div>
        ) : (
          <DisciplineSelector 
            disciplines={disciplines} 
            selectedDisciplineName={selectedDisciplineName} 
            onDisciplineChange={handleDisciplineChange} 
          />
        )}
      </div>

      <div>
        {loadingObjects ? (
          <div>Cargando objetos...</div>
        ) : errorObjects ? (
          <div className="text-red-500">{errorObjects}</div>
        ) : objects.length === 0 ? (
          <div>No tienes objetos en esta disciplina.</div> 
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objects.map((object) => (
              <ObjectCard key={object._id} object={object} onObjectUpdated={handleObjectUpdated} onObjectDeleted={handleObjectDeleted}/>
            ))}
          </div>
        )}
      </div>

      {objects.length > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {isModalOpen && (
        <CreateObject 
          disciplines={disciplines} 
          onClose={closeModal} 
          onObjectCreated={handleObjectCreated} 
        />
      )}
    </div>
  );
};

export default ObjectsByDiscipline;
