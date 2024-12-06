require('dotenv').config();

module.exports = {
  port: process.env.PORT || 443,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  email: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  url: process.env.BASE_URL,
  sslKeyPath: process.env.SSL_KEY_PATH || path.join(__dirname, '../ssl/server.key'),
  sslCertPath: process.env.SSL_CERT_PATH || path.join(__dirname, '../ssl/server.cert'),

};