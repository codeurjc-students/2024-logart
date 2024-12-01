// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from '../utilities/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [objects, setObjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    // Obtener disciplinas disponibles
    const fetchDisciplines = async () => {
      try {
        const response = await axios.get('/api/v1/objects/disciplines'); // Asegúrate de tener esta ruta en tu backend
        setDisciplines(response.data.disciplines);
      } catch (error) {
        console.error('Error al obtener disciplinas:', error);
      }
    };

    fetchDisciplines();
  }, []);

  useEffect(() => {
    // Obtener objetos según filtros
    const fetchObjects = async () => {
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (discipline) params.discipline = discipline;

        const response = await axios.get('/api/v1/objects', { params });
        setObjects(response.data.objects);
      } catch (error) {
        console.error('Error al obtener objetos:', error);
      }
    };

    fetchObjects();
  }, [searchTerm, discipline]);

  return (
    <div>
      <h1 className="text-3xl mb-4">Galería de Objetos</h1>
      <div className="flex mb-6">
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="border p-2 rounded mr-4 w-full"
        />
        <select 
          value={discipline} 
          onChange={(e) => setDiscipline(e.target.value)} 
          className="border p-2 rounded"
        >
          <option value="">Todas las Disciplinas</option>
          {disciplines.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {objects.map(obj => (
          <div key={obj._id} className="border rounded shadow">
            <img src={obj.imageUrl} alt={obj.name} className="w-full h-48 object-cover rounded-t" />
            <div className="p-4">
              <h2 className="text-xl mb-2">{obj.name}</h2>
              <p className="text-gray-700 mb-2">Disciplina: {obj.discipline.name}</p>
              <Link to={`/objects/${obj._id}`} className="text-blue-500">Ver Detalles</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
