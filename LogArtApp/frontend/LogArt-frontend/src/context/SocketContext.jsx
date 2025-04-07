import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  useEffect(() => {
    let newSocket = null;
    if (isAuthenticated && user) {
      console.log("Inicializando Socket.IO...");
      newSocket = io("https://localhost:8443", {
        rejectUnauthorized: false,
        withCredentials: true,
      });
      newSocket.on("connect", () => {
        console.log("Conectado a Socket.IO");
        setConnected(true);
        newSocket.emit("authenticate", {
          userId: user._id,
          role: user.role,
        });
      });
      newSocket.on("connect_error", (err) => {
        console.error("Error de conexión Socket.IO:", err);
        setConnected(false);
      });
      setSocket(newSocket);
    }
    return () => {
      if (newSocket) {
        console.log("Desconectando Socket.IO");
        newSocket.disconnect();
        setConnected(false);
      }
    };
  }, [isAuthenticated, user]);
  useEffect(() => {
    if (socket && connected && user && user.role === "admin") {
      console.log("Configurando escucha de notificaciones para admin");
      socket.on("admin-notification", (data) => {
        console.log("Notificación recibida:", data);
        setNotifications((prev) => [data, ...prev]);
      });
    }
    return () => {
      if (socket) {
        socket.off("admin-notification");
      }
    };
  }, [socket, connected, user]);
  return (
    <SocketContext.Provider
      value={{ socket, connected, notifications, setNotifications }}
    >
      {children}
    </SocketContext.Provider>
  );
};
