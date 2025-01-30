require("dotenv").config();
const path = require("path");

module.exports = {
  port: process.env.PORT || 8443,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  email: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  url: process.env.BASE_URL,
  sslKeyPath: process.env.SSL_KEY_PATH,
  sslCertPath: process.env.SSL_CERT_PATH,
};
