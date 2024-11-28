require('dotenv').config();

module.exports = {
  port: process.env.PORT || 443,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
};