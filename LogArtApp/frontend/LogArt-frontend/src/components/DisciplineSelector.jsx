import React from 'react';

const DisciplineSelector = ({ disciplines, selectedDisciplineName, onDisciplineChange }) => {
  return (
    <div>
      <label htmlFor="discipline" className="block text-gray-700 mb-2">
        Seleccionar Disciplina:
      </label>
      <select
        id="discipline"
        value={selectedDisciplineName}
        onChange={(e) => onDisciplineChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {disciplines.map((discipline) => (
          <option key={discipline._id} value={discipline.name}>
            {discipline.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DisciplineSelector;
