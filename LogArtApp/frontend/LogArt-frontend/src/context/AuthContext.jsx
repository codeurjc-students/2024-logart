import React, { createContext, useState, useEffect } from "react";
import api from "../utilities/api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      api.get('/api/v1/users/profile')
      .then((response) => {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener el perfil del usuario:', error);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/v1/auth', { email, password });
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, message: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  };

  const register = async (username, email, password, firstName, lastName) => {
    try {
      const response = await api.post('/api/v1/users/', { username, email, password, firstName, lastName });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error al registrarse:', error);
      return { success: false, message: error.response?.data?.message || 'Error al registrarse' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/logout');
      
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
