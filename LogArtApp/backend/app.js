const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const objectRoutes = require('./routes/objectRoutes');
const commentRoutes = require('./routes/commentRoutes');
const connectDB = require('./config/db');
const seedDisciplines = require('./utils/seedDisciplines');
const seedAdmins = require('./utils/seedAdmins');


const app = express();
connectDB();
seedDisciplines();
seedAdmins();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api/v1/', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/objects', objectRoutes);
app.use('/api/v1/comments', commentRoutes);


module.exports = app;
