const mongoose = require('mongoose')
const { dbConnectionString } = require('./environment')
const connectDB = async () => {
  try {
    await mongoose.connect(dbConnectionString);
    console.log('MongoDB connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1)
  }
};

module.exports = connectDB