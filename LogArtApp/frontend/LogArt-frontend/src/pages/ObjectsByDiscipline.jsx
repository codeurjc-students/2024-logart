import React, { useState, useEffect, useContext, useRef } from "react";
import api from "../utilities/api";
import { AuthContext } from "../context/AuthContext";
import DisciplineSelector from "../components/DisciplineSelector";
import ObjectCard from "../components/ObjectCard";
import CreateObject from "../components/CreateObject";
import { ModalContext } from "../context/ModalContext";

const ObjectsByDiscipline = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { openModal } = useContext(ModalContext);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisciplineName, setSelectedDisciplineName] = useState("");
  const [objects, setObjects] = useState([]);
  const [loadingDisciplines, setLoadingDisciplines] = useState(true);
  const [loadingObjects, setLoadingObjects] = useState(false);
  const [errorDisciplines, setErrorDisciplines] = useState("");
  const [errorObjects, setErrorObjects] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const debounceTimeoutRef = useRef(null);
  const userId = isAuthenticated && user ? user._id : null;
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await api.get("/api/v1/users/favorites");
          const favoritesMap = {};
          response.data.favorites.forEach((id) => {
            favoritesMap[id] = true;
          });
          setFavorites(favoritesMap);
          setShowFavoritesOnly(false);
        } catch (error) {
          console.error("Error al obtener favoritos:", error);
        }
      }
    };
    if (isAuthenticated && user) {
      fetchFavorites();
    }
  }, [isAuthenticated, user]);
  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await api.get("/api/v1/disciplines");
        setDisciplines(response.data.disciplines);
        if (response.data.disciplines.length > 0) {
          setSelectedDisciplineName(response.data.disciplines[0].name);
        }
        setLoadingDisciplines(false);
      } catch (error) {
        console.error("Error al obtener disciplinas:", error);
        setErrorDisciplines(
          error.response?.data?.message || "Error al obtener disciplinas"
        );
        setLoadingDisciplines(false);
      }
    };
    fetchDisciplines();
  }, []);
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      debounceTimeoutRef.current = null;
    }, 500);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, [searchQuery]);
  useEffect(() => {
    if (selectedDisciplineName && userId) {
      fetchObjects(
        selectedDisciplineName,
        userId,
        currentPage,
        debouncedSearchQuery
      );
    }
  }, [
    selectedDisciplineName,
    userId,
    currentPage,
    debouncedSearchQuery,
    showFavoritesOnly,
  ]);
  const fetchObjects = async (
    disciplineName,
    userId,
    page,
    query,
    favoriteOverride = null
  ) => {
    setLoadingObjects(true);
    setErrorObjects("");
    try {
      const favoriteValue =
        favoriteOverride !== null ? favoriteOverride : showFavoritesOnly;
      const response = await api.get(
        `api/v1/objects/${encodeURIComponent(disciplineName)}`,
        {
          params: {
            userId,
            page,
            limit,
            objectName: query,
            favoritesOnly: favoriteValue.toString(),
          },
        }
      );
      setObjects(response.data.objects);
      if (favoriteValue) {
        const newFavorites = { ...favorites };
        response.data.objects.forEach((obj) => {
          newFavorites[obj._id] = true;
        });
        setFavorites(newFavorites);
      } else if (favoriteOverride === false) {
        try {
          const favResponse = await api.get("/api/v1/users/favorites");
          const favoritesMap = {};
          favResponse.data.favorites.forEach((id) => {
            favoritesMap[id] = true;
          });
          setFavorites(favoritesMap);
        } catch (error) {
          console.error("Error al refrescar favoritos:", error);
        }
      }
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error al obtener objetos:", error);
      setErrorObjects(
        error.response?.data?.message || "Error al obtener objetos"
      );
    } finally {
      setLoadingObjects(false);
    }
  };
  const handleToggleFavorite = (objectId, isFavorite) => {
    setFavorites((prev) => {
      const updated = { ...prev };
      if (isFavorite) {
        updated[objectId] = true;
      } else {
        delete updated[objectId];
      }
      return updated;
    });
    if (showFavoritesOnly && !isFavorite) {
      setTimeout(() => {
        fetchObjects(
          selectedDisciplineName,
          userId,
          currentPage,
          debouncedSearchQuery
        );
      }, 100);
    }
  };
  const handleToggleFavoritesFilter = () => {
    const newValue = !showFavoritesOnly;
    setShowFavoritesOnly(newValue);
    setCurrentPage(1);
    if (!newValue) {
      api
        .get("/api/v1/users/favorites")
        .then((response) => {
          const favoritesMap = {};
          response.data.favorites.forEach((id) => {
            favoritesMap[id] = true;
          });
          setFavorites(favoritesMap);
        })
        .catch((error) => {
          console.error("Error al obtener favoritos:", error);
        });
    }
    setTimeout(() => {
      fetchObjects(
        selectedDisciplineName,
        userId,
        1,
        debouncedSearchQuery,
        newValue
      );
    }, 100);
  };
  const handleDisciplineChange = (disciplineName) => {
    setSelectedDisciplineName(disciplineName);
    setCurrentPage(1);
    setSearchQuery("");
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    setDebouncedSearchQuery("");
  };
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const handleObjectCreated = () => {
    fetchObjects(selectedDisciplineName, userId, currentPage, searchQuery);
  };
  const handleObjectUpdated = (updatedObject) => {
    fetchObjects(selectedDisciplineName, userId, currentPage, searchQuery);
  };
  const handleObjectDeleted = (deletedObjectId) => {
    setObjects((prevObjects) =>
      prevObjects.filter((object) => object._id !== deletedObjectId)
    );
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleOpenCreateModal = () => {
    openModal(
      <CreateObject
        disciplines={disciplines}
        onObjectCreated={handleObjectCreated}
      />
    );
  };
  return (
    <section>
      <div className="w-full max-w-10xl bg-transparent bg-gradient-to-r from-blue-950 via-blue-600 to-blue-900 opacity-90 p-8 rounded-lg shadow-lg border border-gray-400 shadow-black">
        <div className="pt-24">
          {" "}
          <div className="pt-10"></div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center mb-6">
          <h2 className="text-3xl font-bold pr-4 text-white mb-4 lg:mb-0">
            Bienvenido a la galería de
          </h2>
          <div className="w-full lg:w-1/3 flex items-center">
            {" "}
            {loadingDisciplines ? (
              <div className="text-white">Cargando disciplinas...</div>
            ) : errorDisciplines ? (
              <div className="text-red-500">{errorDisciplines}</div>
            ) : (
              <div className="flex items-center w-full">
                {" "}
                <div className="flex-grow">
                  {" "}
                  <DisciplineSelector
                    disciplines={disciplines}
                    selectedDisciplineName={selectedDisciplineName}
                    onDisciplineChange={handleDisciplineChange}
                  />
                </div>
                <button
                  onClick={handleToggleFavoritesFilter}
                  className={`ml-3 px-3 py-2 rounded-full flex items-center ${
                    showFavoritesOnly
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                  aria-label={
                    showFavoritesOnly ? "Mostrar todos" : "Mostrar favoritos"
                  }
                >
                  {showFavoritesOnly ? "❤️" : "🤍"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleOpenCreateModal}
            className="px-4 bg-green-500 opacity-90 text-white py-2 rounded hover:bg-purple-700 transition-colors duration-300 font-bold"
            aria-label="Crear nuevo objeto"
          >
            Crear Objeto
          </button>
        </div>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por nombre del objeto..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-1/2 px-4 py-2 bg-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
            aria-label="Buscar por nombre del objeto"
          />
        </div>
        <div>
          {loadingObjects ? (
            <div className="text-white">Cargando objetos...</div>
          ) : errorObjects ? (
            <div className="text-red-500">{errorObjects}</div>
          ) : objects.length === 0 ? (
            <div className="flex justify-center text-white pb-10">
              No tienes objetos en esta disciplina.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {objects.map((object) => (
                <ObjectCard
                  key={object._id}
                  object={object}
                  disciplines={disciplines}
                  onObjectUpdated={handleObjectUpdated}
                  onObjectDeleted={handleObjectDeleted}
                  isFavorite={favorites[object._id] || false}
                  onToggleFavorite={handleToggleFavorite}
                />
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
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <span className="text-white">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ObjectsByDiscipline;
