require('dotenv').config();

const config = require('./config.json')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const User = require('./models/user.model');

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

app.post('/api/v1/users', async (req, res) => {
  try {
    const {password, email, firstName, lastName, username} = req.body;

  if (!password || !email || !firstName || !lastName || !username) {
    return res.status(400).json({ error: true, message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: true, message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ password: hashedPassword, email, firstName, lastName, username });
  await user.save();

  const accessToken = jwt.sign({ userId: user._id }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '24h' });

    return res.status(201)
    .location(`/api/v1/users/${user._id}`)
    .json({  
      user: { firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username },
      accessToken,
      message: 'User created successfully',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

app.post('/api/v1/auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Both fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user._id }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' });

    return res.status(200).json({
      user: { firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username },
      accessToken,
      message: 'Login successful',
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
  
});

app.listen(443, () => {
  console.log('Server running on port 443');
});

module.exports = app