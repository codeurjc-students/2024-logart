function notifyAdmins(req, notification) {
  const io = req.app.get("io");
  const adminSockets = req.app.get("adminSockets");
  if (!io || !adminSockets) {
    console.error(
      "Socket.io no está inicializado o no hay sockets de administrador disponibles."
    );
    return;
  }
  console.log("Enviando notificación a los administradores conectados.");
  adminSockets.forEach((socketId) => {
    io.to(socketId).emit("admin-notification", notification);
  });
}
module.exports = {
  notifyAdmins,
};
