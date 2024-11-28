const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/v1/', authRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
