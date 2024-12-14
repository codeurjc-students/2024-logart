import React, { useState, useRef, useEffect } from "react";

const DisciplineSelector = ({
  disciplines,
  selectedDisciplineName,
  onDisciplineChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSelect = (discipline) => {
    onDisciplineChange(discipline);
    setIsOpen(false);
  };
  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full bg-white border border-gray-500 rounded px-9 py-4 text-left font-medium text-3xl flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-600"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="discipline-label"
      >
        <span className="text-gray-900">
          {selectedDisciplineName || "Selecciona una disciplina"}
        </span>
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="gray"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white border border-gray-500 rounded shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-labelledby="discipline-label"
        >
          {disciplines.map((discipline) => (
            <li
              key={discipline._id}
              onClick={() => handleSelect(discipline.name)}
              className="cursor-pointer px-6 py-3 hover:bg-purple-600 hover:text-white text-gray-900 text-lg"
              role="option"
              aria-selected={selectedDisciplineName === discipline.name}
            >
              {discipline.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisciplineSelector;
