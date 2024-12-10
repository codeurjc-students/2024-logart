const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const objectRoutes = require('./routes/objectRoutes');
const commentRoutes = require('./routes/commentRoutes');
const disciplineRoutes = require('./routes/disciplineRoutes');
const connectDB = require('./config/db');
const cors = require('cors');
const seedDB = require('./Seeders/seedDB'); 


const app = express();


app.use(cors({
  origin: ['https://localhost:5173', 'https://editor.swagger.io', 'https://codeurjc-students.github.io'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api/v1/', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/objects', objectRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/disciplines', disciplineRoutes);


module.exports = app;
