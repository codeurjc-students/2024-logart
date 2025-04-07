const app = require("./app");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { sslKeyPath, sslCertPath, port } = require("./config/environment");
const connectDB = require("./config/db");
const seedDB = require("./Seeders/seedDB");
const { Server } = require("socket.io");

const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, sslKeyPath)),
  cert: fs.readFileSync(path.resolve(__dirname, sslCertPath)),
};
const adminSockets = new Map();
async function startServer() {
  if (process.env.NODE_ENV !== "test") {
    await connectDB();
    await seedDB();
  }
  const server = https.createServer(sslOptions, app);
  const io = new Server(server, {
    cors: {
      origin: [
        "https://localhost:5173",
        "https://editor.swagger.io",
        "https://codeurjc-students.github.io",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("Usuario autenticado: ", socket.id);
    socket.on("authenticate", (userData) => {
      console.log("Usuario autenticado: ", userData);
      socket.userId = userData.userId;
      socket.userRole = userData.role;
      if (userData.role === "admin") {
        adminSockets.set(userData.userId, socket.id);
        console.log("Administrador conectado: ", userData.userId);
      }
    });
    socket.on("disconnect", () => {
      console.log("Usuario desconectado: ", socket.id);
      if (socket.userRole === "admin") {
        adminSockets.delete(socket.userId);
        console.log("Administrador desconectado: ", socket.userId);
      }
    });
  });

  app.set("io", io);
  app.set("adminSockets", adminSockets);
  server.listen(port, () => {
    console.log(`Server HTTPS with Socket.io running on port ${port}`);
  });
}
startServer();
