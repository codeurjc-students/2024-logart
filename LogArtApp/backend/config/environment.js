require('dotenv').config();

module.exports = {
  port: process.env.PORT || 443,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  email: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  url: process.env.BASE_URL

};