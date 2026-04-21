const app = require("./app");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { sslKeyPath, sslCertPath, port } = require("./config/environment");
const connectDB = require("./config/db");
const seedDB = require("./Seeders/seedDB");
const { Server } = require("socket.io");

const PORT = process.env.PORT || port || 3000;
const isProduction = process.env.NODE_ENV === "production";
const adminSockets = new Map();
async function startServer() {
  if (process.env.NODE_ENV !== "test") {
    await connectDB();
    await seedDB();
  }

  let server;
  if (isProduction) {
    console.log(
      "Starting server in production mode (HTTP - Railway covers the SSL",
    );
    server = http.createServer(app);
  } else {
    console.log("Starting server in development mode (HTTPS)");
    const sslOptions = {
      key: fs.readFileSync(path.resolve(__dirname, sslKeyPath)),
      cert: fs.readFileSync(path.resolve(__dirname, sslCertPath)),
    };
    server = https.createServer(sslOptions, app);
  }

  const allowedOrigins = [
    "https://localhost:5173",
    "https://editor.swagger.io",
    "https://codeurjc-students.github.io",
  ];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);
    socket.on("authenticate", (userData) => {
      console.log("User authenticated: ", userData);
      socket.userId = userData.userId;
      socket.userRole = userData.role;
      if (userData.role === "admin") {
        adminSockets.set(userData.userId, socket.id);
        console.log("Admin connected: ", userData.userId);
      }
    });
    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
      if (socket.userRole === "admin") {
        adminSockets.delete(socket.userId);
        console.log("Admin disconnected: ", socket.userId);
      }
    });
  });

  app.set("io", io);
  app.set("adminSockets", adminSockets);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
