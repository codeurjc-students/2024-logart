import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../utilities/api";
import {
  FaUsers,
  FaChartLine,
  FaDatabase,
  FaList,
  FaChartBar,
  FaTachometerAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path !== "dashboard") {
      setActiveTab(path);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = `/api/v1/dashboard/${activeTab}`;
        if (activeTab === "objects") {
          endpoint = `/api/v1/dashboard/all-objects`;
        } else if (activeTab === "users") {
          const [dashboardResponse, usersResponse] = await Promise.all([
            axios.get(endpoint),
            axios.get(`/api/v1/users?page=1&limit=10`),
          ]);
          setDashboardData({
            ...dashboardData,
            [activeTab]: {
              ...dashboardResponse.data,
              usersList: usersResponse.data.users,
              totalPages: usersResponse.data.totalPages,
            },
          });
          setError(null);
          setLoading(false);
          return;
        } else if (activeTab === "activity" || activeTab === "growth") {
          endpoint += `?period=${period}`;
        }

        const response = await axios.get(endpoint);
        setDashboardData({ ...dashboardData, [activeTab]: response.data });
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${activeTab} data:`, err);
        setError(`No se pudieron cargar los datos de ${activeTab}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, period]);

  const renderActiveTab = () => {
    if (loading) return <LoadingIndicator />;
    if (error) return <ErrorDisplay message={error} />;

    switch (activeTab) {
      case "overview":
        return <OverviewTab data={dashboardData.overview} />;
      case "users":
        return (
          <UsersTab
            data={dashboardData.users}
            setDashboardData={setDashboardData}
          />
        );
      case "content":
        return <ContentTab data={dashboardData.content} />;
      case "activity":
        return (
          <ActivityTab
            data={dashboardData.activity}
            period={period}
            setPeriod={setPeriod}
          />
        );
      case "growth":
        return (
          <GrowthTab
            data={dashboardData.growth}
            period={period}
            setPeriod={setPeriod}
          />
        );
      case "objects":
        return <ObjectsTab data={dashboardData.objects} />;
      default:
        return <OverviewTab data={dashboardData.overview} />;
    }
  };

  return (
    <section className="min-h-screen pt-20 bg-gradient-to-r from-blue-950 via-blue-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Panel de Administración
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-gray-400 overflow-hidden">
          <div className="flex flex-wrap text-sm md:text-base">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<FaTachometerAlt />}
              label="Resumen"
            />
            <TabButton
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              icon={<FaUsers />}
              label="Usuarios"
            />
            <TabButton
              active={activeTab === "content"}
              onClick={() => setActiveTab("content")}
              icon={<FaDatabase />}
              label="Contenido"
            />
            <TabButton
              active={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
              icon={<FaChartBar />}
              label="Actividad"
            />
            <TabButton
              active={activeTab === "growth"}
              onClick={() => setActiveTab("growth")}
              icon={<FaChartLine />}
              label="Crecimiento"
            />
            <TabButton
              active={activeTab === "objects"}
              onClick={() => setActiveTab("objects")}
              icon={<FaList />}
              label="Objetos"
            />
          </div>

          <div className="p-6">{renderActiveTab()}</div>
        </div>
      </div>
    </section>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    className={`px-4 py-3 flex items-center gap-2 transition-colors ${
      active
        ? "bg-blue-700 text-white border-b-2 border-white"
        : "bg-blue-950/70 text-gray-300 hover:bg-blue-800"
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="bg-red-500/20 text-red-100 p-4 rounded-md">
    <p>{message}</p>
  </div>
);

const OverviewTab = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Resumen General</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Usuarios Totales" value={data.totalUsers} />
        <StatCard title="Objetos Totales" value={data.totalObjects} />
        <StatCard title="Comentarios Totales" value={data.totalComments} />
      </div>

      <div className="bg-white/5 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Objetos por Disciplina
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.objectsByDiscipline?.map((item, index) => (
            <div key={index} className="bg-blue-900/40 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white">
                {item.discipline}
              </h4>
              <p className="text-2xl font-bold text-blue-300">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">
          Crecimiento de Objetos
        </h3>
        <div className="flex items-center">
          <div className="text-3xl font-bold mr-3 text-white">
            {data.recentObjects}
          </div>
          <div
            className={`text-lg font-medium ${
              data.objectsGrowth >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {data.objectsGrowth >= 0 ? "+" : ""}
            {data.objectsGrowth.toFixed(1)}%
          </div>
        </div>
        <p className="text-gray-300 mt-2">
          En comparación con el período anterior
        </p>
      </div>
    </div>
  );
};

const UsersTab = ({ data, setDashboardData }) => {
  const [users, setUsers] = useState(data?.usersList || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  useEffect(() => {
    fetchUsers();
  }, [page]);
  useEffect(() => {
    if (data?.usersList) {
      setUsers(data.usersList);
    }
  }, [data]);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/users?page=${page}&limit=${limit}`
      );
      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async (userId, username, userRole) => {
    if (!userId) return;
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario "${username}"? Esta acción eliminará todos sus objetos y comentarios y no se puede deshacer.`
    );
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await axios.delete(`/api/v1/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      if (data) {
        const updatedTotalUsers = data.totalUsers - 1;
        const updatedUsersByRole = data.usersByRole.map((roleData) => {
          if (roleData.role === userRole) {
            return { ...roleData, count: roleData.count - 1 };
          }
          return roleData;
        });
        const updateUsersByObjectCount = data.usersByObjectCount
          ? data.usersByObjectCount.filter((user) => user.userName !== username)
          : [];
        setDashboardData((prevData) => ({
          ...prevData,
          users: {
            ...prevData.users,
            totalUsers: updatedTotalUsers,
            usersByRole: updatedUsersByRole,
            usersList: users.filter((user) => user._id !== userId),
            usersByObjectCount: updateUsersByObjectCount,
          },
        }));
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error al eliminar el usuario. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };
  if (!data && users.length === 0)
    return <div className="text-white">Cargando usuarios...</div>;
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Estadísticas de Usuarios
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">
            Usuarios por Rol
          </h3>
          <div className="space-y-4">
            {data?.usersByRole?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="text-lg text-white capitalize">{item.role}</div>
                <div className="text-xl font-bold text-blue-300">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">
            Total de Usuarios
          </h3>
          <div className="text-4xl font-bold text-white">
            {data?.totalUsers}
          </div>
        </div>
      </div>
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">
          Gestión de Usuarios
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3">Usuario</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Rol</th>
                <th className="text-left py-3">Nombre</th>
                <th className="text-center py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="py-3">{user.username}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3 capitalize">{user.role}</td>
                  <td className="py-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-3 text-center">
                    <button
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                      onClick={() =>
                        handleDeleteUser(user._id, user.username, user.role)
                      }
                      disabled={loading || user.role === "admin"}
                      title={
                        user.role === "admin"
                          ? "No se pueden eliminar administradores"
                          : ""
                      }
                    >
                      {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data?.totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(data.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-full ${
                  page === i + 1 ? "bg-blue-600" : "bg-blue-900"
                } text-white`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white/5 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Usuarios más Activos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3">Usuario</th>
                <th className="text-right py-3">Objetos Creados</th>
              </tr>
            </thead>
            <tbody>
              {data?.usersByObjectCount?.map((user, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-3">{user.userName}</td>
                  <td className="text-right py-3 font-medium text-blue-300">
                    {user.objectCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ContentTab = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Análisis de Contenido
      </h2>

      <div className="bg-white/5 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Distribución por Disciplina
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.objectsByDiscipline?.map((item, index) => (
            <div key={index} className="bg-blue-900/40 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white">
                {item.discipline}
              </h4>
              <p className="text-2xl font-bold text-blue-300">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">
          Objetos más Comentados
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3">Nombre del Objeto</th>
                <th className="text-right py-3">Comentarios</th>
              </tr>
            </thead>
            <tbody>
              {data.mostCommentedObjects?.map((object, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-3">
                    <Link
                      to={`/objects/${object.objectId}`}
                      className="text-blue-300 hover:underline"
                    >
                      {object.name}
                    </Link>
                  </td>
                  <td className="text-right py-3 font-medium text-blue-300">
                    {object.commentCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ActivityTab = ({ data, period, setPeriod }) => {
  console.log("Activity data:", data);
  if (!data) return null;

  const maxCount =
    data.objectsActivity && data.objectsActivity.length > 0
      ? Math.max(...data.objectsActivity.map((a) => a.count))
      : 1;
  const maxHeightPx = 200;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Actividad de la Plataforma
      </h2>

      <div className="mb-6 flex space-x-4">
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">
          Creación de Objetos
        </h3>
        {data.objectsActivity?.length > 0 ? (
          <div className="h-80">
            <div className="flex items-end h-64 space-x-2">
              {data.objectsActivity.map((item, index) => {
                const heightPx = Math.max(
                  20,
                  (item.count / maxCount) * maxHeightPx
                );
                console.log("Item:", item, "HeightPx:", heightPx);

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="text-center mb-2 text-blue-300 font-bold">
                      {item.count}
                    </div>
                    <div
                      className="w-full bg-emerald-500 rounded-t transition-all duration-500 hover:bg-emerald-400 border border-white"
                      style={{
                        height: `${heightPx}px`,
                        boxShadow: "0 0 8px rgba(59, 130, 246, 0.8)",
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-300 truncate w-full text-center">
                      {item.period}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-300">
            No hay datos de actividad para mostrar
          </p>
        )}
      </div>
    </div>
  );
};

const GrowthTab = ({ data, period, setPeriod }) => {
  if (!data) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Análisis de Crecimiento
      </h2>

      <div className="mb-6 flex space-x-4">
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GrowthCard
          title="Usuarios"
          current={data.metrics.users.current}
          previous={data.metrics.users.previous}
          growth={data.metrics.users.growth}
        />

        <GrowthCard
          title="Objetos"
          current={data.metrics.objects.current}
          previous={data.metrics.objects.previous}
          growth={data.metrics.objects.growth}
        />

        <GrowthCard
          title="Comentarios"
          current={data.metrics.comments.current}
          previous={data.metrics.comments.previous}
          growth={data.metrics.comments.growth}
        />
      </div>
    </div>
  );
};

const ObjectsTab = ({ data }) => {
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const debounceTimeoutRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState(data?.objects || []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      let endpoint = `/api/v1/dashboard/all-objects?page=${page}&limit=10`;

      if (debounceSearchTerm) {
        endpoint += `&searchTerm=${encodeURIComponent(debounceSearchTerm)}`;
      }

      if (selectedDiscipline) {
        endpoint += `&disciplineName=${encodeURIComponent(selectedDiscipline)}`;
      }

      const response = await axios.get(endpoint);
      setObjects(response.data.objects || []);
    } catch (err) {
      console.error("Error searching objects:", err);
      alert("Error al buscar objetos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
      debounceTimeoutRef.current = null;
    }, 500);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [debounceSearchTerm, selectedDiscipline, page]);

  useEffect(() => {
    if (data?.objects) {
      setObjects(data.objects);
    }
  }, [data]);

  if (!data) return null;

  const handleDelete = async (objectId, objectName) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar "${objectName}"?`
    );
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await axios.delete(`/api/v1/objects/${objectId}`);
      setObjects((prevObjects) =>
        prevObjects.filter((obj) => obj._id !== objectId)
      );
    } catch (error) {
      console.error("Error al eliminar el objeto:", error);
      alert(error.response?.data?.message || "Error al eliminar el objeto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Moderación de Contenido
      </h2>

      <div className="bg-white/5 p-6 rounded-lg mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar objetos..."
              className="w-full px-4 py-2 bg-blue-950/50 border border-gray-600 rounded text-white"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full px-4 py-2 bg-blue-950/50 border border-gray-600 rounded text-white"
            >
              <option value="">Todas las disciplinas</option>
              {data.filters?.disciplines.map((disc) => (
                <option key={disc.id} value={disc.name}>
                  {disc.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3">Nombre</th>
                <th className="text-left py-3">Disciplina</th>
                <th className="text-left py-3">Creado por</th>
                <th className="text-center py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {objects.map((object) => (
                <tr key={object._id} className="border-b border-gray-700">
                  <td className="py-3">
                    <Link
                      to={`/objects/${object._id}`}
                      className="text-blue-300 hover:underline"
                    >
                      {object.name}
                    </Link>
                  </td>
                  <td className="py-3">{object.discipline.name}</td>
                  <td className="py-3">
                    {object.createdBy?.username || "Usuario desconocido"}
                  </td>
                  <td className="py-3 text-center">
                    <Link
                      to={`/objects/${object._id}`}
                      className="text-blue-300 hover:underline mr-4"
                    >
                      Ver
                    </Link>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(object._id, object.name)}
                      disabled={loading}
                    >
                      {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.pagination && data.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(data.pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-full ${
                  page === i + 1 ? "bg-blue-600" : "bg-blue-900"
                } text-white`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white/5 p-6 rounded-lg">
    <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
    <div className="text-3xl font-bold text-white">{value}</div>
  </div>
);

const PeriodSelector = ({ value, onChange }) => (
  <div className="inline-flex bg-blue-900/50 rounded overflow-hidden">
    <button
      className={`px-4 py-2 text-sm ${
        value === "weekly" ? "bg-blue-700 text-white" : "text-gray-300"
      }`}
      onClick={() => onChange("weekly")}
    >
      Semanal
    </button>
    <button
      className={`px-4 py-2 text-sm ${
        value === "monthly" ? "bg-blue-700 text-white" : "text-gray-300"
      }`}
      onClick={() => onChange("monthly")}
    >
      Mensual
    </button>
    <button
      className={`px-4 py-2 text-sm ${
        value === "quarterly" ? "bg-blue-700 text-white" : "text-gray-300"
      }`}
      onClick={() => onChange("quarterly")}
    >
      Trimestral
    </button>
  </div>
);

const GrowthCard = ({ title, current, previous, growth }) => (
  <div className="bg-white/5 p-6 rounded-lg">
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    <div className="text-3xl font-bold text-white mb-2">{current}</div>
    <div className="flex items-center">
      <div
        className={`text-lg ${growth >= 0 ? "text-green-400" : "text-red-400"}`}
      >
        {growth >= 0 ? "+" : ""}
        {growth.toFixed(1)}%
      </div>
      <div className="text-gray-400 text-sm ml-2">vs. {previous} anterior</div>
    </div>
  </div>
);

export default AdminDashboard;
