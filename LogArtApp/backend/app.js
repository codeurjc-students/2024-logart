const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const objectRoutes = require('./routes/objectRoutes');
const connectDB = require('./config/db');
const seedDisciplines = require('./utils/seedDisciplines');


const app = express();
connectDB();
seedDisciplines();


app.use(express.json());
app.use('/api/v1/', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/objects', objectRoutes);

module.exports = app;
