const app = require("./app");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { sslKeyPath, sslCertPath, port } = require("./config/environment");
const connectDB = require("./config/db");
const seedDB = require("./Seeders/seedDB");

const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, sslKeyPath)),
  cert: fs.readFileSync(path.resolve(__dirname, sslCertPath)),
};
async function startServer() {
  if (process.env.NODE_ENV !== "test") {
    await connectDB();
    await seedDB();
  }
  https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Servidor HTTPS corriendo en https://localhost:${port}`);
  });
}
startServer();
