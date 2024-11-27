require('dotenv').config();

const config = require('./config.json')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

//Test API
app.get('/test', (req, res) => {
  return res.status(200).json({message: "Test API"})
})

app.listen(443);
module.exports = app