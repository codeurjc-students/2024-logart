const app = require('./app');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { sslKeyPath, sslCertPath, port } = require('./config/environment');

const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, sslKeyPath)),
  cert: fs.readFileSync(path.resolve(__dirname, sslCertPath)),
};

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${port}`);
});
