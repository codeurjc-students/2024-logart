const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { accessTokenSecret } = require('../config/environment');
const BlacklistedToken = require('../models/blacklist.model');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: true, message: 'User not found' });

    if (!email || !password) return res.status(400).json({ error: true, message: 'Both fields are required' });

    if (user.hastoken) {
      return res.status(401).json({ error: true, message: 'User already logged in' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: true, message: 'Invalid credentials' });

    const accessToken = jwt.sign({ userId: user._id }, accessTokenSecret, { expiresIn: '24h' });
    user.hastoken = true;
    await user.save();

    return res.status(200).json({ accessToken, message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
  try {
    const { password, email, firstName, lastName, username } = req.body;
    
    const loggedUser = await User.findOne({hastoken: true});
    if (loggedUser) {
      return res.status(401).json({ error: true, message: 'You are already logged in' });
    }

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

    return res.status(201).location(`/api/v1/users/${user._id}`).json({ user: { firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username }, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  const ADDITIONAL_TOKEN_EXP_TIME = 5 * 60 * 1000;
  const authHeader = req.headers['authorization'];
  const userIdFromToken = req.user.userId;
  const user = await User.findById(userIdFromToken);
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401).json({ error: true, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    const originalExpirationDate = new Date(decoded.exp * 1000);
    const extendedExpirationDate = new Date(originalExpirationDate.getTime() + ADDITIONAL_TOKEN_EXP_TIME);

    await BlacklistedToken.create({ token, expiresAt: extendedExpirationDate });
    user.hastoken = false;
    await user.save();

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

module.exports = { login, register, logout };