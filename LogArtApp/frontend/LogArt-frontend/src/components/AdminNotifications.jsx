import React, { useContext, useState, useRef, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { Link } from "react-router-dom";

const AdminNotifications = () => {
  const { notifications, setNotifications } = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const clearNotifications = () => {
    setNotifications([]);
  };
  const removeNotification = (index) => {
    setNotifications((prev) => {
      const newNotifications = [...prev];
      newNotifications.splice(index, 1);
      return newNotifications;
    });
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " +
      date.toLocaleDateString()
    );
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-blue-800 rounded-full focus:outline-none"
        aria-label="Notificaciones"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2 px-4 bg-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Notificaciones
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Limpiar todas
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="py-2 px-4 border-b hover:bg-gray-50"
                >
                  <Link
                    to={`/objects/${notification.objectId}`}
                    onClick={() => {
                      setIsOpen(false);
                      removeNotification(index);
                    }}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {notification.userName} ha compartido un objeto
                    </p>
                    <p className="text-xs text-gray-600 font-semibold">
                      "{notification.objectName}"
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-4 px-4 text-sm text-gray-500 text-center">
                No hay notificaciones nuevas
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
